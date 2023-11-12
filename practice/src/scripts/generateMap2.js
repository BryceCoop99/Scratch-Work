const mapSizeToDimensions = {
  large: { width: 100, height: 100 },
  medium: { width: 80, height: 80 },
  small: { width: 50, height: 50 },
  tiny: { width: 15, height: 15 },
};

const roomSizeToDimensions = {
  small: { width: 7, height: 7},
  tiny: { width: 5, height: 5}
}

function generateMap(size = "tiny") {
  const map = {matrix: []}

  // Initiate Map
  if (size.toLowerCase() in mapSizeToDimensions) {
    map.dimensions = mapSizeToDimensions[size.toLowerCase()];
    map.matrix = createMatrix(map.dimensions.width, map.dimensions.height);
  } else {
    console.log("invalid map size");
    return;
  }
  console.log(map);

  // Start somewhere (close to any side)
  const startingSide = getRandomStartingSide();
  let startX;
  let startY;
  if (startingSide === "top") {
    startX = getRandomInt(1, map.dimensions.width - 1);
    startY = 1;
  } else if (startingSide === "left") {
    startX = 1;
    startY = getRandomInt(1, map.dimensions.height - 1);
  } else if (startingSide === "right") {
    startX = map.dimensions.width - 1;
    startY = getRandomInt(1, map.dimensions.height - 1);
  } else if (startingSide === "bottom") {
    startX = getRandomInt(1, map.dimensions.width - 1);
    startY = map.dimensions.height - 1;
  }

  console.log(startX);
  console.log(startY);

  // Create a room
  const newRoom = getRandomRoomSize();
  // clone matrix
  const newMatrix = cloneMatrix(map.matrix);
  // loop to see if the room works!
  // const result = addRoomToMatrix(newMatrix, newRoom);
  let directions = ["north", "south", "east", "west"];
  while (directions.length > 0) {
   const result = getRandomFromArrayAndRemove(directions);
   const direction = result.direction;

   directions = result.updatedDirections;
   console.log(directions);
  }
}

function createMatrix(width, height, initialValue = 0) {
  return Array.from({ length: height }, () => Array(width).fill(initialValue));
}

function cloneMatrix(matrix) {
  const clonedMatrix = [];
  for (const row of matrix) {
    clonedMatrix.push([...row]);
  }
  return clonedMatrix;
}

function getRandomFromArrayAndRemove(directions) {
  const randomIndex = Math.floor(Math.random() * directions.length);
  const selectedDirection = directions[randomIndex];
  directions.splice(randomIndex, 1);
  return { direction: selectedDirection, updatedDirections: directions };
}

function getRandomStartingSide() {
  const randomValue = Math.random();

  if (randomValue < 0.25) {
    return "top";
  } else if (randomValue < 0.5) {
    return "left";
  } else if (randomValue < 0.75) {
    return "right";
  } else {
    return "bottom";
  }
};

function getRandomRoomSize() {
  const keys = Object.keys(roomSizeToDimensions);
  const totalKeys = keys.length;

  const randomIndex = getRandomInt(0, totalKeys);
  const selectedKey = keys[randomIndex];

  return selectedKey;
}

// function getRandomRoom() {
//   const randomValue = Math.random();

//   if (randomValue < 0.25) {
//     return "tiny";
//   } else if (randomValue < 0.5) {
//     return "tiny";
//   } else if (randomValue < 0.75) {
//     return "tiny";
//   } else {
//     return "tiny";
//   }
// };

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// export {generateMap};
export { generateMap, getRandomInt };