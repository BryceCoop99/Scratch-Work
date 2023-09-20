// generateRandomMap.test.js
const { generateRandomMap } = require('../scripts/generateMap');

describe('generateRandomMap Function', () => {
  it('should generate a map with no rooms', () => {
    const map = generateRandomMap(5, 5, 0, 5);
    expect(map).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });

  it('should generate a map with the maximum number of rooms', () => {
    const map = generateRandomMap(10, 10, 100, 5); // High number of rooms
    expect(map.flat().filter((cell) => cell === 1).length).toBe(100);
  });

  it('should generate a map with very large dimensions', () => {
    const map = generateRandomMap(1000, 1000, 5, 5); // Large map dimensions
    expect(map.length).toBe(1000);
    expect(map[0].length).toBe(1000);
  });

  // Add more test cases for generateRandomMap
});