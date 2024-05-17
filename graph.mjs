// This function takes a graph as input and returns true if there is a cycle in the graph, and false otherwise.
function hasCycle(graph, startPath) {
  const V = graph.size;
  const visited = new Map();
  const recStack = new Map();
  graph.forEach((_, path) => {
    visited[path] = false;
    recStack[path] = false;
  });

  // Call the recursive helper function to
  // detect cycle in different DFS trees
  //   for (let i = 0; i < V; i++)
  //     if (isCyclicUtil(i, visited, recStack, graph)) return true;

  return isCyclicUtil(startPath, visited, recStack, graph);
}

function isCyclicUtil(path, visited, recStack, graph) {
  console.log(path);

  // Mark the current node as visited and
  // part of recursion stack
  if (recStack.get(path)) return true;

  if (visited.get(path)) return false;

  visited.set(path, true);
  recStack.set(path, true);

  let children = graph.get(path);

  for (const c in children) {
    if (isCyclicUtil(c, visited, recStack, graph)) return true;
  }

  recStack[path] = false;
  return false;
}

export default hasCycle;
