import parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { transformFromAstAsync } from "@babel/core";
import { showError } from "./logging";
import { v4 as uuidv4 } from "uuid";

async function createAsset(assetPath) {
  let content;
  try {
    content = await Bun.file(assetPath).text();
  } catch (error) {
    showError("Error reading file: \n" + assetPath);
  }
  const ast = parser.parse(content, {
    sourceType: "module",
  });

  const dependencies = new Set();

  traverse(ast, {
    ImportDeclaration: {
      enter(path) {
        dependencies.add(path.node.source.value);
      },
    },

    CallExpression: {
      enter(path) {
        if (t.isIdentifier(path.node.callee, { name: "require" })) {
          dependencies.add(path.node.arguments[0].value);
        }
      },
    },
  });

  // generate code from ast
  //Transpilation to maintain compatibility.
  const { code } = await transformFromAstAsync(ast, content, {
    presets: ["@babel/preset-env"],
  });

  return {
    id: uuidv4(),
    dependencies,
    content: code,
  };
}

export async function generateDependencyGraph(entryPath, rootPath) {
  const entryAsset = await createAsset(entryPath);
  const queue = [entryAsset];

  const assets = new Map(); // mapping of asset id to asset
  const graph = new Map(); // directed graph of dependencies
  entryPath = resolveDependecyPath(entryPath, rootPath);
  assets.set(entryPath, entryAsset);
  while (queue.length != 0) {
    const asset = queue.shift();
    asset.depMap = new Map(); // mapping of dependency to module id

    const dependencies = [];
    for (const dep of asset.dependencies) {
      const filePath = resolveDependecyPath(dep, rootPath);
      if (!assets.has(filePath)) {
        const childAsset = await createAsset(filePath);
        asset.depMap.set(dep, childAsset.id);
        dependencies.push([filePath, childAsset.id]);
        assets.set(dep, childAsset);
        queue.push(childAsset);
      } else {
        const childAsset = assets.get(filePath);
        dependencies.push([filePath, childAsset.id]);
      }
    }
    graph.set(asset.id, dependencies);
  }
  return [assets, graph, entryAsset];
}

function resolveDependecyPath(depPath, rootPath) {
  try {
    return Bun.resolveSync(depPath, rootPath);
  } catch (error) {
    showError(error.message);
  }
}

// This function takes a graph as input and returns true if there is a cycle in the graph, and false otherwise.
export function hasCycle(graph, startPath, startId) {
  const visited = new Map();
  const recStack = new Map();
  graph.forEach((_, id) => {
    visited[id] = false;
    recStack[id] = false;
  });

  return isCyclicUtil(
    [startPath, startId],
    visited,
    recStack,
    graph,
    startPath
  );
}

function isCyclicUtil(node, visited, recStack, graph, parentPath) {
  const [filePath, id] = node;
  if (recStack.get(id)) return [true, parentPath];
  if (visited.get(id)) return [false, undefined];

  visited.set(id, true);
  recStack.set(id, true);

  let children = graph.get(id);
  for (let i = 0; i < children.length; i++) {
    const [isCyclic, cyclicPath] = isCyclicUtil(
      children[i],
      visited,
      recStack,
      graph,
      filePath
    );
    if (isCyclic) return [true, cyclicPath];
  }

  recStack[id] = false;
  return [false, undefined];
}

export default { hasCycle, generateDependencyGraph };
