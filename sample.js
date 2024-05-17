// This function takes a graph as input and returns true if there is a cycle in the graph, and false otherwise.
function hasCycle(graph) {
  // Create a visited array to keep track of which nodes have been visited.
  const visited = new Array(graph.length).fill(false);

  // Recursively check for cycles starting at each node in the graph.
  for (let i = 0; i < graph.length; i++) {
    if (!visited[i] && hasCycleHelper(graph, i, visited)) {
      return true;
    }
  }

  // If we reach this point, there is no cycle in the graph.
  return false;
}

// This helper function recursively checks for cycles starting at a given node.
function hasCycleHelper(graph, node, visited) {
  // Mark the current node as visited.
  visited[node] = true;

  // Recursively check for cycles starting at each of the current node's neighbors.
  for (const neighbor of graph[node]) {
    if (!visited[neighbor] && hasCycleHelper(graph, neighbor, visited)) {
      return true;
    }
  }

  // If we reach this point, there is no cycle starting at the current node.
  return false;
}

// Example usage:
const graph = [
  [1, 2],
  [2, 3],
  [3, 1],
]; // This graph has a cycle.
const hasCycle = hasCycle(graph); // This will return true.
