// Function to generate a random map matrix
function generateRandomMap(width, height, numRooms, roomSize) {
  const map = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
  const rooms = [];

  for (let roomCount = 0; roomCount < numRooms; roomCount++) {
    let roomWidth, roomHeight, roomX, roomY;
    
    let attempts = 0;
    let isOverlap = false; // Track if there's an overlap
    while (attempts < 3) {
      const minSize = Math.floor(roomSize * 0.9);
      const maxSize = Math.floor(roomSize * 2);
      roomWidth = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
      roomHeight = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
      roomX = Math.floor(Math.random() * (width - roomWidth + 1));
      roomY = Math.floor(Math.random() * (height - roomHeight + 1));

      // Check if the room coordinates are within valid bounds
      if (roomX >= 0 && roomX + roomWidth <= width && roomY >= 0 && roomY + roomHeight <= height) {
        isOverlap = rooms.some((existingRoom) => (
          roomX < existingRoom.x + existingRoom.width &&
          roomX + roomWidth > existingRoom.x &&
          roomY < existingRoom.y + existingRoom.height &&
          roomY + roomHeight > existingRoom.y
        ));

        if (!isOverlap) {
          createRoomWithVariation(map, roomX, roomY, roomWidth, roomHeight);
          rooms.push({ x: roomX, y: roomY, width: roomWidth, height: roomHeight });
          break;
        }
      }

      attempts++;
    }
  }

  for (let i = 1; i < rooms.length; i++) {
    const roomA = rooms[i - 1];
    const roomB = rooms[i];
  
    const startX = Math.floor(roomA.x + roomA.width / 2);
    const startY = Math.floor(roomA.y + roomA.height / 2);
    const endX = Math.floor(roomB.x + roomB.width / 2);
    const endY = Math.floor(roomB.y + roomB.height / 2);
  
    createLinearPath(startX, startY, endX, endY, map, rooms);
    // randomWalk(startX, startY, endX, endY, map, rooms);
  }

  return map.flat();
}

function randomWalk(startX, startY, endX, endY, map, rooms) {
  let currentX = startX;
  let currentY = startY;

  while (currentX !== endX || currentY !== endY) {
    const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

    if (direction === 'horizontal') {
      if (currentX < endX) currentX++;
      else if (currentX > endX) currentX--;
    } else {
      if (currentY < endY) currentY++;
      else if (currentY > endY) currentY--;
    }

    if (!isOverlapping({x: currentX, y: currentY}, rooms)) {
      setPathWidth(map, currentX, currentY, map.length, map[0].length);
    }
  }
}

function createLinearPath(startX, startY, endX, endY, map, rooms) {
  let currentX = startX;
  let currentY = startY;

  // Move horizontally until x-coordinates align
  while (currentX !== endX) {
    if (currentX < endX) currentX++;
    else if (currentX > endX) currentX--;

    if (!isOverlapping({ x: currentX, y: currentY }, rooms)) {
      setPathWidth(map, currentX, currentY, map.length, map[0].length);
    }
  }

  // Move vertically until y-coordinates align
  while (currentY !== endY) {
    if (currentY < endY) currentY++;
    else if (currentY > endY) currentY--;

    if (!isOverlapping({ x: currentX, y: currentY }, rooms)) {
      setPathWidth(map, currentX, currentY, map.length, map[0].length);
    }
  }
}


function isOverlapping(point, rooms) {
  return rooms.some(room => {
    return point.x >= room.x && point.x < room.x + room.width &&
      point.y >= room.y && point.y < room.y + room.height;
  });
}

function createRoomWithVariation(map, x, y, width, height) {
  const variationFactor = Math.random() * 0.3 - 0.1;
  let roomWidth = Math.floor(width + width * variationFactor);
  let roomHeight = Math.floor(height + height * variationFactor);
  const offsetX = Math.floor((width - roomWidth) / 2);
  const offsetY = Math.floor((height - roomHeight) / 2);

  if (y + offsetY + roomHeight >= map.length || x + offsetX + roomWidth >= map[0].length) {
    roomWidth = Math.min(roomWidth, map[0].length - (x + offsetX));
    roomHeight = Math.min(roomHeight, map.length - (y + offsetY));
  }

  for (let i = y + offsetY; i < y + offsetY + roomHeight; i++) {
    for (let j = x + offsetX; j < x + offsetX + roomWidth; j++) {
      if (map[i] && map[i][j] !== undefined) {
        map[i][j] = 1;
      }
    }
  }
}

function setPathWidth(map, x, y, width, height) {
  const minWidth = 2;  // Minimum path width
  const maxWidth = 3;  // Maximum path width

  // Generate a random path width between minWidth and maxWidth
  const pathWidth = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;

  for (let deltaY = -pathWidth; deltaY <= pathWidth; deltaY++) {
    for (let deltaX = -pathWidth; deltaX <= pathWidth; deltaX++) {
      const newX = x + deltaX;
      const newY = y + deltaY;
      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        map[newY][newX] = 1;
      }
    }
  }
}

export { generateRandomMap, createRoomWithVariation, setPathWidth };