import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { generateRandomMap } from "../../scripts/generateMap";
import { generateMap } from "../../scripts/generateMap2";
import { generateMapAI } from "../../scripts/generateMapAI";
import { generateMap2 } from "../../scripts/generateMapAI2";
import BackgroundImage from "../../assets/dark-stone4.png";
import Delaunator from "delaunator";

function DungeonMap2() {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(50); // Default map width
  const [height, setHeight] = useState(50); // Default map height
  const [numRooms, setNumRooms] = useState(6); // Number of rooms
  const [roomSize, setRoomSize] = useState(20); // Default room size

  const GRIDSIZE = 50;
  let delaunay;
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current);

    const groundColor = "transparent"; // Color for ground areas
    const blackColor = "black"; // Color for black areas
    const cellSize = 20; // Size of each cell (adjust as needed)


    let panning = false;
    let lastRenderedTime = 0; // To keep track of when we last rendered
    const frameSkip = 2; // Number of frames to skip

    canvas.on('mouse:up', (e) => {
      panning = false;
    });
    canvas.on('mouse:down', (e) => {
      panning = true;
    });
    canvas.on('mouse:move', (e) => {
      if (panning && e && e.e) {
        // Skip frames for smoother panning
        const currentTime = Date.now();
        if (currentTime - lastRenderedTime < frameSkip) return;
    
        const delta = new fabric.Point(e.e.movementX, e.e.movementY);
        canvas.relativePan(delta);
        lastRenderedTime = currentTime;
      }
    });
    const debounce = (fn, delay) => {
      let timer;
      return function() {
        const context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(context, args);
        }, delay);
      };
    };
    canvas.on('mouse:wheel', debounce((opt) => {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom += delta / 200;
      zoom = Math.min(20, Math.max(0.5, zoom));
      const pointer = canvas.getPointer(opt.e);
      const point = new fabric.Point(pointer.x, pointer.y);
    
      canvas.zoomToPoint(point, zoom);
    
      opt.e.preventDefault();
      opt.e.stopPropagation();
    }, 100));  // 50 milliseconds delay


    // const initialChance = 0.29;
    // const steps = 5;
    // let dungeonMap = generateMap2(GRIDSIZE/2, GRIDSIZE/2, initialChance, steps);
    // dungeonMap = dungeonMap.flat();
    // console.log(dungeonMap);


    const entrances = [[0, 1], [1, 0], [49, 48], [48, 49]]; // Array of entrance points
    const depth = 4;
    const dungeonMap = generateMapAI(GRIDSIZE, GRIDSIZE, entrances, depth).flat();


    // let startTime = performance.now();
    // const dungeonMap = generateRandomMap(GRIDSIZE, GRIDSIZE, numRooms, roomSize);
    // let endTime = performance.now();
    // let timeElapsed = endTime - startTime;
    // console.log(`Time taken: ${timeElapsed} milliseconds`);

    const rectsToAdd = []; // Store rectangles to add in batch
    canvas.renderOnAddRemove = false; // Disable auto rendering
    fabric.Image.fromURL(BackgroundImage, (bgImg) => {

      for (let i = 0; i < dungeonMap.length; i += GRIDSIZE) {
        const row = dungeonMap.slice(i, i + GRIDSIZE);
        
        row.forEach((cell, x) => {
          const y = Math.floor(i / GRIDSIZE);
          const fillColor = cell === 1 ? groundColor : blackColor;

          const rect = new fabric.Rect({
            left: x * cellSize,
            top: y * cellSize,
            width: cellSize,
            height: cellSize,
            fill: fillColor,
            stroke: fillColor,
            strokeWidth: 1,
            selectable: false,
            objectCaching: false, // To speed up rendering
          });
          
          rectsToAdd.push(rect);
        });
      }

      canvas.add(...rectsToAdd); // Batch add
      requestAnimationFrame(() => { // To speed up rendering even more
        canvas.renderAll();
      });

      // Set repeat properties for background image
      // const patternCanvas = document.createElement('canvas');
      // patternCanvas.width = 100;
      // patternCanvas.height = 100;

      // const ctx = patternCanvas.getContext('2d');
      // bgImg.scaleToWidth(0);
      // bgImg.scaleToHeight(100);
      
      // bgImg.setCoords();
      // bgImg.render(ctx);

      // const pattern = new fabric.Pattern({
      //   source: patternCanvas,  // Directly passing canvas element
      //   repeat: 'repeat'
      // });

      // canvas.setBackgroundColor(pattern, canvas.renderAll.bind(canvas));

      const canvasWidth = GRIDSIZE * cellSize;
      const canvasHeight = GRIDSIZE * cellSize;
      canvas.setDimensions({
        width: canvasWidth,
        height: canvasHeight,
      });
      bgImg.scaleToWidth(canvas.width);
      bgImg.scaleToHeight(canvas.height);
      canvas.setBackgroundImage(bgImg, canvas.renderAll.bind(canvas));
    });

  }, [width, height, numRooms, roomSize]);

  function drawPoints(e) {
    e.preventDefault();
    // const matrix = generateMap();
  }

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
      <button onClick={drawPoints}>Draw Points</button>
      <br />
      <canvas ref={canvasRef} width={800} height={800}></canvas>
    </div>
  );
}

export default DungeonMap2;
