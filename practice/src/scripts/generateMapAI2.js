// Initialize the map with random walls and empty spaces
function initializeMap(width, height, initialChance) {
  let map = Array.from(Array(height), () => Array(width).fill(0));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      map[y][x] = Math.random() < initialChance ? 1 : 0;
    }
  }
  return map;
}

// Cellular automata step to refine the map
function performAutomataStep(map) {
  let newMap = JSON.parse(JSON.stringify(map));
  let height = map.length;
  let width = map[0].length;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let wallCount = countWalls(map, x, y);
      
      // Rule 1: If a cell has 4 or more wall neighbors, it becomes a wall
      // Rule 2: If a cell has 2 or fewer wall neighbors, it becomes empty
      if (wallCount >= 4) {
        newMap[y][x] = 1;
      } else if (wallCount <= 2) {
        newMap[y][x] = 0;
      }
    }
  }
  return newMap;
}

// Count the neighboring wall cells of a cell
function countWalls(map, x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      let ny = y + dy;
      let nx = x + dx;
      if (ny >= 0 && ny < map.length && nx >= 0 && nx < map[0].length) {
        count += map[ny][nx];
      } else {
        count++; // Count out-of-bound cells as walls
      }
    }
  }
  return count;
}

// Generate the map
function generateMap2(width, height, initialChance, steps) {
  let map = initializeMap(width, height, initialChance);
  for (let i = 0; i < steps; i++) {
    map = performAutomataStep(map);
  }
  return map;
}

export { generateMap2 };