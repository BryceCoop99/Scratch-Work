import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { generateRandomMap } from '../../scripts/generateMap';
import BackgroundImage from '../../assets/stone-ground.png';

function DungeonMap() {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(50); // Default map width
  const [height, setHeight] = useState(50); // Default map height
  const [numRooms, setNumRooms] = useState(4); // Number of rooms
  const [roomSize, setRoomSize] = useState(10); // Default room size

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current);

    const groundColor = 'transparent'; // Color for ground areas
    const blackColor = 'black';  // Color for black areas
    const cellSize = 12;         // Size of each cell (adjust as needed)

    const dungeonMap = generateRandomMap(width, height, numRooms, roomSize);
    
    // Load the background image
    fabric.Image.fromURL(BackgroundImage, (bgImg) => {
      bgImg.scaleToWidth(canvas.width);
      bgImg.scaleToHeight(canvas.height);
      canvas.setBackgroundImage(bgImg, canvas.renderAll.bind(canvas));

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const isGround = dungeonMap[y][x] === 1;

          if (isGround) {
            // Create transparent path areas
            const rect = new fabric.Rect({
              left: x * cellSize,
              top: y * cellSize,
              width: cellSize,
              height: cellSize,
              fill: groundColor, // Fill with transparent color
              selectable: false,
            });
            canvas.add(rect); // Add the transparent path rectangle to the canvas
          } else {
            // Create transparent path areas
            const rect = new fabric.Rect({
              left: x * cellSize,
              top: y * cellSize,
              width: cellSize,
              height: cellSize,
              fill: blackColor,
              selectable: false,
            });
            canvas.add(rect); // Add the transparent path rectangle to the canvas
          }
        }
      }

      canvas.renderAll();
    });
  }, [width, height, numRooms, roomSize]);

  return (
    <div>
      <label>Map Width:</label>
      <input
        type="number"
        min="1"
        value={width}
        onChange={(e) => setWidth(parseInt(e.target.value))}
      />
      <br />
      <label>Map Height:</label>
      <input
        type="number"
        min="1"
        value={height}
        onChange={(e) => setHeight(parseInt(e.target.value))}
      />
      <br />
      <label>Number of Rooms:</label>
      <input
        type="number"
        min="1"
        value={numRooms}
        onChange={(e) => setNumRooms(parseInt(e.target.value))}
      />
      <br />
      <label>Default Room Size:</label>
      <input
        type="number"
        min="1"
        value={roomSize}
        onChange={(e) => setRoomSize(parseInt(e.target.value))}
      />
      <br />
      <canvas ref={canvasRef} width={800} height={600}></canvas>
    </div>
  );
}

export default DungeonMap;
