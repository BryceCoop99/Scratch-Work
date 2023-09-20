import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { generateRandomMap } from "../../scripts/generateMap";
import BackgroundImage from "../../assets/dark-stone4.png";
import Delaunator from "delaunator";

function DungeonMap2() {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(50); // Default map width
  const [height, setHeight] = useState(50); // Default map height
  const [numRooms, setNumRooms] = useState(6); // Number of rooms
  const [roomSize, setRoomSize] = useState(20); // Default room size

  const GRIDSIZE = 150;
  let delaunay;
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current);

    const groundColor = "transparent"; // Color for ground areas
    const blackColor = "black"; // Color for black areas
    const cellSize = 5; // Size of each cell (adjust as needed)

    // const JITTER = 0.9;
    // let points = [];
    // for (let x = 0; x <= GRIDSIZE; x++) {
    //   for (let y = 0; y <= GRIDSIZE; y++) {
    //     points.push({
    //       x: x + JITTER * (Math.random() - Math.random()),
    //       y: y + JITTER * (Math.random() - Math.random()),
    //     });
    //   }
    // }
    // points.push({ x: -10, y: GRIDSIZE / 2 });
    // points.push({ x: GRIDSIZE + 10, y: GRIDSIZE / 2 });
    // points.push({ y: -10, x: GRIDSIZE / 2 });
    // points.push({ y: GRIDSIZE + 10, x: GRIDSIZE / 2 });
    // points.push({ x: -10, y: -10 });
    // points.push({ x: GRIDSIZE + 10, y: GRIDSIZE + 10 });
    // points.push({ y: -10, x: GRIDSIZE + 10 });
    // points.push({ y: GRIDSIZE + 10, x: -10 });
    // let ctx = canvas.getContext("2d");
    // ctx.save();
    // ctx.scale(canvas.width / GRIDSIZE, canvas.height / GRIDSIZE);
    // for (let { x, y } of points) {
    //   ctx.beginPath();
    //   ctx.arc(x, y, 0.1, 0, 2 * Math.PI);
    //   ctx.fill();
    // }
    // ctx.restore();
    // delaunay = Delaunator.from(
    //   points,
    //   (loc) => loc.x,
    //   (loc) => loc.y
    // );
    // let map = {
    //   points,
    //   numRegions: points.length,
    //   numTriangles: delaunay.halfedges.length / 3,
    //   numEdges: delaunay.halfedges.length,
    //   halfedges: delaunay.halfedges,
    //   triangles: delaunay.triangles,
    //   centers: calculateCentroids(points, delaunay),
    // };

    // let { centers, halfedges, triangles, numEdges } = map;
    // ctx.save();
    // ctx.scale(canvas.width / GRIDSIZE, canvas.height / GRIDSIZE);
    // ctx.lineWidth = 0.02;
    // ctx.strokeStyle = "black";
    // for (let e = 0; e < numEdges; e++) {
    //   if (e < delaunay.halfedges[e]) {
    //     const p = centers[triangleOfEdge(e)];
    //     const q = centers[triangleOfEdge(halfedges[e])];
    //     ctx.beginPath();
    //     ctx.moveTo(p.x, p.y);
    //     ctx.lineTo(q.x, q.y);
    //     ctx.stroke();
    //   }
    // }
    // ctx.restore();

    // const dungeonMap = generateRandomMap(GRIDSIZE, GRIDSIZE, numRooms, roomSize);
    // map.elevation = dungeonMap;
    // console.log(map.elevation);

    // drawCellColors(canvas, map, (r) =>
    //   map.elevation[r] === 1 ? "black" : "transparent"
    // );


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
    }, 500));  // 50 milliseconds delay

    // let startTime = performance.now();
    const dungeonMap = generateRandomMap(GRIDSIZE, GRIDSIZE, numRooms, roomSize);
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
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = 100;
      patternCanvas.height = 100;

      const ctx = patternCanvas.getContext('2d');
      bgImg.scaleToWidth(0);
      bgImg.scaleToHeight(100);
      
      bgImg.setCoords();
      bgImg.render(ctx);

      const pattern = new fabric.Pattern({
        source: patternCanvas,  // Directly passing canvas element
        repeat: 'repeat'
      });

      canvas.setBackgroundColor(pattern, canvas.renderAll.bind(canvas));

      // const canvasWidth = GRIDSIZE * cellSize;
      // const canvasHeight = GRIDSIZE * cellSize;
      // canvas.setDimensions({
      //   width: canvasWidth,
      //   height: canvasHeight,
      // });
      // bgImg.scaleToWidth(canvas.width);
      // bgImg.scaleToHeight(canvas.height);
      // canvas.setBackgroundImage(pattern, canvas.renderAll.bind(canvas));
    });

  }, [width, height, numRooms, roomSize]);

  function drawPoints(e) {
    e.preventDefault();
  }

  function calculateCentroids(points, delaunay) {
    const numTriangles = delaunay.halfedges.length / 3;
    let centroids = [];
    for (let t = 0; t < numTriangles; t++) {
      let sumOfX = 0,
        sumOfY = 0;
      for (let i = 0; i < 3; i++) {
        let s = 3 * t + i;
        let p = points[delaunay.triangles[s]];
        sumOfX += p.x;
        sumOfY += p.y;
      }
      centroids[t] = { x: sumOfX / 3, y: sumOfY / 3 };
    }
    return centroids;
  }
  function triangleOfEdge(e) {
    return Math.floor(e / 3);
  }
  function nextHalfedge(e) {
    return e % 3 === 2 ? e - 2 : e + 1;
  }
  function edgesAroundPoint(delaunay, start) {
    const result = [];
    let incoming = start;
    do {
      result.push(incoming);
      const outgoing = nextHalfedge(incoming);
      incoming = delaunay.halfedges[outgoing];
    } while (incoming !== -1 && incoming !== start);
    return result;
  }
  async function drawCellColors(canvas, map, colorFn) {
    let ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(canvas.width / GRIDSIZE, canvas.height / GRIDSIZE);
    let seen = new Set(); // of region ids
    let { triangles, numEdges, centers } = map;
    // await new Promise((resolve, reject) => {
    //   fabric.Image.fromURL(BackgroundImage, (img) => {
    //     if (!img) {
    //       console.error("Failed to load image");
    //       reject(new Error("Failed to load image"));
    //       return;
    //     }
    //     img.set({
    //       scaleX: canvas.width / img.width,
    //       scaleY: canvas.height / img.height,
    //     });
    //     canvas.setBackgroundImage(
    //       img,
    //       () => {
    //         console.log("Background image set and canvas rendered.");
    //         canvas.renderAll();
    //         resolve();
    //       },
    //       { originX: "left", originY: "top", opacity: 1 }
    //     );
    //   });
    // });
    for (let e = 0; e < numEdges; e++) {
      const r = triangles[nextHalfedge(e)];
      if (!seen.has(r)) {
        seen.add(r);
        let vertices = edgesAroundPoint(delaunay, e).map(
          (e) => centers[triangleOfEdge(e)]
        );
        ctx.fillStyle = colorFn(r);
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
          ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.fill();
      }
    }
    
    // Load the background image
    // fabric.Image.fromURL(BackgroundImage, (bgImg) => {
    //   // bgImg.scaleToWidth(canvas.width);
    //   // bgImg.scaleToHeight(canvas.height);
    //   canvas.setBackgroundImage(bgImg, canvas.renderAll.bind(canvas));

    //   // for (let y = 0; y < height; y++) {
    //   //   for (let x = 0; x < width; x++) {
    //   //     const isGround = dungeonMap[y][x] === 1;

    //   //     if (isGround) {
    //   //       // Create transparent path areas
    //   //       const rect = new fabric.Rect({
    //   //         left: x * cellSize,
    //   //         top: y * cellSize,
    //   //         width: cellSize,
    //   //         height: cellSize,
    //   //         fill: groundColor, // Fill with transparent color
    //   //         selectable: false,
    //   //       });
    //   //       canvas.add(rect); // Add the transparent path rectangle to the canvas
    //   //     } else {
    //   //       // Create transparent path areas
    //   //       const rect = new fabric.Rect({
    //   //         left: x * cellSize,
    //   //         top: y * cellSize,
    //   //         width: cellSize,
    //   //         height: cellSize,
    //   //         fill: blackColor,
    //   //         selectable: false,
    //   //       });
    //   //       canvas.add(rect); // Add the transparent path rectangle to the canvas
    //   //     }
    //   //   }
    //   // }

    //   canvas.renderAll();
    // });
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
      <canvas ref={canvasRef} width={800} height={600}></canvas>
    </div>
  );
}

export default DungeonMap2;
