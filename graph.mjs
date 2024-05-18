import parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { transformFromAstAsync } from "@babel/core";
import { showError } from "./logging";

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
      dependencies.push(filePath);
      if (!assets.has(filePath)) {
        const childAsset = await createAsset(filePath);
        asset.depMap.set(dep, filePath);
        assets.set(dep, childAsset);
        queue.push(childAsset);
      }
    }
    graph.set(asset.assetPath, dependencies);
  }
  return [assets, graph];
}

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
    assetPath,
    dependencies,
    content: code,
  };
}

function resolveDependecyPath(depPath, rootPath) {
  try {
    return Bun.resolveSync(depPath, rootPath);
  } catch (error) {
    showError(error.message);
  }
}

// This function takes a graph as input and returns true if there is a cycle in the graph, and false otherwise.
export function hasCycle(graph, startPath) {
  const visited = new Map();
  const recStack = new Map();
  graph.forEach((_, path) => {
    visited[path] = false;
    recStack[path] = false;
  });

  return isCyclicUtil(startPath, visited, recStack, graph, startPath);
}

function isCyclicUtil(path, visited, recStack, graph, parentPath) {
  if (recStack.get(path)) return [true, parentPath];
  if (visited.get(path)) return [false, undefined];

  visited.set(path, true);
  recStack.set(path, true);

  let children = graph.get(path);
  for (let i = 0; i < children.length; i++) {
    const [isCyclic, cyclicPath] = isCyclicUtil(
      children[i],
      visited,
      recStack,
      graph,
      path
    );
    if (isCyclic) return [true, cyclicPath];
  }

  recStack[path] = false;
  return [false, undefined];
}

export default { hasCycle, generateDependencyGraph };
