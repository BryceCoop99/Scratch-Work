// Initialize map
function initializeMap(width, height, entrances) {
  const map = Array.from(Array(height), () => Array(width).fill(0));
  entrances.forEach(([x, y]) => { map[y][x] = 1; });
  return map;
}

// Create room
function createRoom(map, x, y, width, height) {
  for (let dy = y; dy < y + height; dy++) {
    for (let dx = x; dx < x + width; dx++) {
      map[dy][dx] = 1;
    }
  }
  return { x, y, width, height };
}

// Connect two rooms with a corridor
function connectRooms(map, room1, room2) {
  const x1 = room1.x + Math.floor(room1.width / 2);
  const y1 = room1.y + Math.floor(room1.height / 2);
  const x2 = room2.x + Math.floor(room2.width / 2);
  const y2 = room2.y + Math.floor(room2.height / 2);

  let x = x1, y = y1;
  while (x !== x2 || y !== y2) {
    if (Math.random() < 0.5) {
      if (x < x2) {
        x++;
      } else if (x > x2) {
        x--;
      }
    } else {
      if (y < y2) {
        y++;
      } else if (y > y2) {
        y--;
      }
    }
    map[y][x] = 1;
  }
}

// Generate and partition the map
function generateMapAI(width, height, entrances, depth) {
  const map = initializeMap(width, height, entrances);
  const rooms = [];

  function partition(x, y, partitionWidth, partitionHeight, depth) {
    if (depth === 0) return;

    let horizontal = Math.random() < 0.5;
    if (horizontal) {
      const split = Math.floor(Math.random() * (partitionHeight - 20)) + 10;
      partition(x, y, partitionWidth, split, depth - 1);
      partition(x, y + split, partitionWidth, partitionHeight - split, depth - 1);
    } else {
      const split = Math.floor(Math.random() * (partitionWidth - 20)) + 10;
      partition(x, y, split, partitionHeight, depth - 1);
      partition(x + split, y, partitionWidth - split, partitionHeight, depth - 1);
    }

    const roomWidth = Math.floor(Math.random() * (partitionWidth - 5)) + 5;
    const roomHeight = Math.floor(Math.random() * (partitionHeight - 5)) + 5;
    const roomX = Math.floor(Math.random() * (partitionWidth - roomWidth)) + x;
    const roomY = Math.floor(Math.random() * (partitionHeight - roomHeight)) + y;
    const room = createRoom(map, roomX, roomY, roomWidth, roomHeight);
    rooms.push(room);
  }

  partition(0, 0, width, height, depth);

  // Connect all rooms to ensure no closed-off rooms
  for (let i = 1; i < rooms.length; i++) {
    connectRooms(map, rooms[i - 1], rooms[i]);
  }

  return map;
}

export { generateMapAI };