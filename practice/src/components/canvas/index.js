import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import BackgroundImage from "../../assets/background-image.jpg";
import BackgroundPattern from "../../assets/stone-tile.png";
import SquareBrush from "../../brushes/SquareBrush";
import Delaunator from "delaunator";
import { createNoise2D } from "simplex-noise";
import "./styles.css";

export default function App() {
  const { editor, onReady } = useFabricJSEditor();
  const [hoverObject, setHoverObject] = useState(null);

  const history = [];
  const [color, setColor] = useState("#35363a");
  const [cropImage, setCropImage] = useState(true);

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }

    // if (cropImage) {
    //   editor.canvas.__eventListeners = {};
    //   return;
    // }

    if (!editor.canvas.__eventListeners["mouse:wheel"]) {
      editor.canvas.on("mouse:wheel", function (opt) {
        var delta = opt.e.deltaY;
        var zoom = editor.canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        editor.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    }

    if (!editor.canvas.__eventListeners["mouse:down"]) {
      editor.canvas.on("mouse:down", function (opt) {
        var evt = opt.e;
        if (evt.ctrlKey === true) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:move"]) {
      editor.canvas.on("mouse:move", function (opt) {
        if (this.isDragging) {
          var e = opt.e;
          var vpt = this.viewportTransform;
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:up"]) {
      editor.canvas.on("mouse:up", function (opt) {
        // on mouse up we want to recalculate new interaction
        // for all objects, so we call setViewportTransform
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
      });
    }

    
    // editor.canvas.on("mouse:over", function (opt) {
    //   if (opt.target && opt.target._element && opt.target._element.tagName === 'image') {
    //     opt.target.set({
    //       opacity: 0.5
    //     });
    //     editor.canvas.renderAll();
    //   }
    // });
    // if (editor.canvas.__eventListeners["mouse:down"]) {
    //   console.log("yup");
    //   editor.canvas.on("mouse:down", function (opt) {
    //     const pointer = editor.canvas.getPointer(opt.e);
    //     addSVGImage(pointer.x, pointer.y, editor.canvas);
    //   });
    // }
    // editor.canvas.on("mouse:out", function (opt) {
    //   if (opt.target && opt.target._element && opt.target._element.tagName === 'image') {
    //     opt.target.set({
    //       opacity: 1
    //     });
    //     editor.canvas.renderAll();
    //   }
    // });

    editor.canvas.renderAll();
  }, [editor]);

  // Simply loads an SVG to the center of the canvas (svg is in build folder)
  const addSVGImage = (x, y, canvas) => {
    fabric.loadSVGFromURL('snowflake.svg', function (objects, options) {
      const svg = fabric.util.groupSVGElements(objects, options);
      svg.scale(0.2)
        .set({
          left: x - svg.width * svg.scaleX / 2,  // Center the SVG image
          top: y - svg.height * svg.scaleY / 2
        });
      canvas.add(svg).renderAll();
    });
  };

  const addBackground = () => {
    if (!editor || !fabric) {
      return;
    }

    editor.canvas.setBackgroundImage(
      BackgroundImage,
      editor.canvas.renderAll.bind(editor.canvas)
    );
  };

  const fromSvg = () => {
    fabric.loadSVGFromString(
      `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="500" height="500" viewBox="0 0 500 500" xml:space="preserve">
    <desc>Created with Fabric.js 5.3.0</desc>
    <defs>
    </defs>
    <g transform="matrix(1 0 0 1 662.5 750)"  >
      <image style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  xlink:href="https://thegraphicsfairy.com/wp-content/uploads/2019/02/Anatomical-Heart-Illustration-Black-GraphicsFairy.jpg" x="-662.5" y="-750" width="1325" height="1500"></image>
    </g>
    <g transform="matrix(1 0 0 1 120.5 120.5)"  >
    <circle style="stroke: rgb(53,54,58); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-opacity: 0; fill-rule: nonzero; opacity: 1;"  cx="0" cy="0" r="20" />
    </g>
    <g transform="matrix(1 0 0 1 245.5 200.5)"  >
    <line style="stroke: rgb(53,54,58); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  x1="-75" y1="-50" x2="75" y2="50" />
    </g>
    <g transform="matrix(1 0 0 1 141.4 220.03)" style=""  >
        <text xml:space="preserve" font-family="Arial" font-size="16" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(53,54,58); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-16.9" y="-5.46" >inset</tspan><tspan x="-16.9" y="15.51" >text</tspan></text>
    </g>
    <g transform="matrix(1 0 0 1 268.5 98.5)"  >
    <rect style="stroke: rgb(53,54,58); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-opacity: 0; fill-rule: nonzero; opacity: 1;"  x="-20" y="-20" rx="0" ry="0" width="40" height="40" />
    </g>
    </svg>`,
      (objects, options) => {
        editor.canvas._objects.splice(0, editor.canvas._objects.length);
        editor.canvas.backgroundImage = objects[0];
        const newObj = objects.filter((_, index) => index !== 0);
        newObj.forEach((object) => {
          editor.canvas.add(object);
        });

        editor.canvas.renderAll();
      }
    );
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.setHeight(500);
    editor.canvas.setWidth(500);
    addBackground();
    editor.canvas.renderAll();
  }, [editor?.canvas.backgroundImage]);

  const toggleSize = () => {
    editor.canvas.freeDrawingBrush.width === 12
      ? (editor.canvas.freeDrawingBrush.width = 5)
      : (editor.canvas.freeDrawingBrush.width = 12);
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.freeDrawingBrush.color = color;
    editor.setStrokeColor(color);
  }, [color]);

  const GRIDSIZE = 15;
  let delaunay;
  function drawPoints() {
    const JITTER = 0.5;
    let points = [];
    for (let x = 0; x <= GRIDSIZE; x++) {
      for (let y = 0; y <= GRIDSIZE; y++) {
        points.push({
          x: x + JITTER * (Math.random() - Math.random()),
          y: y + JITTER * (Math.random() - Math.random()),
        });
      }
    }
    points.push({ x: -10, y: GRIDSIZE / 2 });
    points.push({ x: GRIDSIZE + 10, y: GRIDSIZE / 2 });
    points.push({ y: -10, x: GRIDSIZE / 2 });
    points.push({ y: GRIDSIZE + 10, x: GRIDSIZE / 2 });
    points.push({ x: -10, y: -10 });
    points.push({ x: GRIDSIZE + 10, y: GRIDSIZE + 10 });
    points.push({ y: -10, x: GRIDSIZE + 10 });
    points.push({ y: GRIDSIZE + 10, x: -10 });

    let ctx = editor.canvas.getContext("2d");
    ctx.save();
    ctx.scale(editor.canvas.width / GRIDSIZE, editor.canvas.height / GRIDSIZE);
    ctx.fillStyle = "hsl(0, 50%, 50%)";
    for (let { x, y } of points) {
      ctx.beginPath();
      ctx.arc(x, y, 0.1, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.restore();

    delaunay = Delaunator.from(
      points,
      (loc) => loc.x,
      (loc) => loc.y
    );
    let map = {
      points,
      numRegions: points.length,
      numTriangles: delaunay.halfedges.length / 3,
      numEdges: delaunay.halfedges.length,
      halfedges: delaunay.halfedges,
      triangles: delaunay.triangles,
      centers: calculateCentroids(points, delaunay),
    };

    let { centers, halfedges, triangles, numEdges } = map;
    ctx.save();
    ctx.scale(editor.canvas.width / GRIDSIZE, editor.canvas.height / GRIDSIZE);
    ctx.lineWidth = 0.02;
    ctx.strokeStyle = "black";
    for (let e = 0; e < numEdges; e++) {
      if (e < delaunay.halfedges[e]) {
        const p = centers[triangleOfEdge(e)];
        const q = centers[triangleOfEdge(halfedges[e])];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
    ctx.restore();
    map.elevation = assignElevation(map);
    // console.log(JSON.stringify(map.elevation));

    // let elevationMatrix = new Array(GRIDSIZE).fill(null).map(() => new Array(GRIDSIZE).fill(0));
    // for (let i = 0; i < GRIDSIZE; i++) {
    //   for (let j = 0; j < GRIDSIZE; j++) {
    //     elevationMatrix[i][j] = map.elevation[i * GRIDSIZE + j];
    //   }
    // }

    // const regions = findRegions(elevationMatrix);
    // // console.log(regions);
    // for (let i = 0; i < regions.length - 1; i++) {
    //   const closestPoints = findClosestPoints(regions[i], regions[i + 1]);
    //   createPath(elevationMatrix, closestPoints[0], closestPoints[1]);
    // }
    // console.log(elevationMatrix);
    // map.elevation = elevationMatrix.reduce((acc, row) => acc.concat(row), []);
    // console.log(map.elevation);
    console.log(map.elevation);
    console.log(map.elevation[10]);
    drawCellColors(editor.canvas, map, (r) =>
      map.elevation[r] < 0.5 ? "hsl(240, 30%, 50%)" : "hsl(90, 20%, 50%)"
    );
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
  const WAVELENGTH = 0.05;
  function assignElevation(map) {
    let noise2D = new createNoise2D();
    let { points, numRegions } = map;
    let elevation = [];

    // Define seed point for single island
    let seed = { x: GRIDSIZE / 2, y: GRIDSIZE / 2 };

    for (let r = 0; r < numRegions; r++) {
      let nx = points[r].x / GRIDSIZE - 1 / 2,
        ny = points[r].y / GRIDSIZE - 1 / 2;

      // Calculate distance from the seed point
      let d = Math.sqrt(
        Math.pow(points[r].x - seed.x, 2) + Math.pow(points[r].y - seed.y, 2)
      );
      d = d / Math.sqrt(Math.pow(GRIDSIZE, 2) + Math.pow(GRIDSIZE, 2)); // Normalize

      // Start with noise
      let baseElevation = (1 + noise2D(nx / WAVELENGTH, ny / WAVELENGTH)) / 2;

      // Enforce elevation decrease based on distance from the seed
      let adjustedElevation = Math.max(0, baseElevation - d);

      elevation[r] = adjustedElevation;
    }

    // Normalize the elevations to a scale of 0 to 1
    let maxElevation = Math.max(...elevation);
    for (let r = 0; r < numRegions; r++) {
      elevation[r] /= maxElevation;
    }

    return elevation;
  }
  function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  // Find closest points between two regions
  function findClosestPoints(region1, region2) {
    let minDistance = Infinity;
    let closestPair;

    for (const [x1, y1] of region1) {
      for (const [x2, y2] of region2) {
        const dist = distance(x1, y1, x2, y2);
        if (dist < minDistance) {
          minDistance = dist;
          closestPair = [[x1, y1], [x2, y2]];
        }
      }
    }

    return closestPair;
  }
  // Create path between two points and set elevation to 0.5
  function createPath(matrix, point1, point2) {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    const maxPathWidth = Math.floor(matrix.length * 0.1);

    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      let randomWidth = Math.floor(Math.random() * (Math.floor(matrix.length * 0.2))) + 1;
      for (let w = 0; w <= randomWidth; w++) {
        if (y1 - w >= 0) matrix[x][y1 - w] = 0.5;
        if (y1 + w < matrix[0].length) matrix[x][y1 + w] = 0.5;
      }
    }

    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      let randomWidth = Math.floor(Math.random() * (Math.floor(matrix.length * 0.2))) + 1;
      for (let w = 0; w <= randomWidth; w++) {
        if (x2 - w >= 0) matrix[x2 - w][y] = 0.5;
        if (x2 + w < matrix.length) matrix[x2 + w][y] = 0.5;
      }
    }
  }
  function findRegions(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const regions = [];
  
    // Helper function for DFS traversal
    const dfs = (x, y, region) => {
      if (x < 0 || x >= rows || y < 0 || y >= cols || visited[x][y]) return;
      
      visited[x][y] = true;
  
      // Only consider cells with elevation 0.5 or higher
      if (matrix[x][y] < 0.5) return;
  
      // Add the current cell to the region
      region.push([x, y]);
  
      // Explore adjacent cells
      dfs(x + 1, y, region);
      dfs(x - 1, y, region);
      dfs(x, y + 1, region);
      dfs(x, y - 1, region);
    };
  
    // Main loop to find regions
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!visited[i][j] && matrix[i][j] >= 0.5) {
          const newRegion = [];
          dfs(i, j, newRegion);
          if (newRegion.length > 0) {
            regions.push(newRegion);
          }
        }
      }
    }
  
    return regions;
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
  function drawCellColors(canvas, map, colorFn) {
    let ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(canvas.width / GRIDSIZE, canvas.height / GRIDSIZE);
    let seen = new Set(); // of region ids
    let { triangles, numEdges, centers } = map;
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
  }


  const toggleDraw = () => {
    const texturePatternBrush = new fabric.PatternBrush(editor.canvas);

    const img = new Image();
    img.src = BackgroundPattern;

    img.onload = function () {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      // Set canvas size to match image and desired opacity
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      // tempCtx.globalAlpha = 0.5; // Set opacity

      // Draw the image onto the temp canvas
      tempCtx.drawImage(img, 0, 0, img.width, img.height);

      // Use the temp canvas as the source
      texturePatternBrush.source = tempCanvas;

      editor.canvas.freeDrawingBrush = texturePatternBrush;
      editor.canvas.isDrawingMode = true;
      editor.canvas.freeDrawingBrush.width = 100;
      editor.canvas.renderAll(); // Force a re-render
    };

    img.onerror = function (err) {
      console.log("Error loading image:", err); // Debugging
    };

    // Using PencilBrush to create a square brush effect
    // const pencilBrush = new fabric.SquareBrush(editor.canvas);

    // editor.canvas.freeDrawingBrush = pencilBrush;
    // editor.canvas.isDrawingMode = true;
  };
  const undo = () => {
    if (editor.canvas._objects.length > 0) {
      history.push(editor.canvas._objects.pop());
    }
    editor.canvas.renderAll();
  };
  const redo = () => {
    if (history.length > 0) {
      editor.canvas.add(history.pop());
    }
  };
  const clear = () => {
    editor.canvas._objects.splice(0, editor.canvas._objects.length);
    history.splice(0, history.length);
    editor.canvas.renderAll();
  };
  const removeSelectedObject = () => {
    editor.canvas.remove(editor.canvas.getActiveObject());
  };
  const onAddCircle = () => {
    editor.addCircle();
    // editor.addLine();
  };
  const onAddRectangle = () => {
    editor.addRectangle();
  };
  const addText = () => {
    editor.addText("insert text");
  };

  // Fetchs the SVG file and returns a string
  async function readSVGFile(fileUrl) {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const svgString = await response.text();
    return svgString;
  }
  async function fetchIMG(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text;
  }

  // Adds an image to the canvas with a distinct svg from the build folder.
  const addImage = async () => {
    try {
      const imageUrl = "/wall.svg";
      fetchIMG(imageUrl)
        .then((svgString) => {
          console.log("Fetched SVG:", svgString);
        })
        .catch((error) => {
          console.error("Failed to fetch SVG:", error);
        });
      const extension = imageUrl.split(".").pop();

      if (extension === "svg") {
        // An example
        var svgString =
          "<svg width='400px' height='400px' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' version='1.1'> <g><path d='M57.2461,75.0045 C57.2461,75.0045 102.605,89.8415 102.605,89.8415 C102.605,89.8415 55.5504,101.286 55.5504,101.286 C55.5504,101.286 62.7569,89.4175 62.7569,89.4175 C62.7569,89.4175 57.2461,75.0045 57.2461,75.0045 Z' style='stroke:none;fill-rule:evenodd;fill:#fc1997;fill-opacity:1;'/></g></svg>";
        // svgString should be overwritten with whatever imageUrl you gave it.
        svgString = await readSVGFile(imageUrl);
        console.log(svgString);

        // This is how to load an SVG from a string.
        // I don't know if there is another way to drop an SVG onto a canvas like this.
        fabric.loadSVGFromString(svgString, function (results, options) {
          if (results && results[0]) {
            const svgElement = results[0];

            svgElement.set({
              left: 100, // X-coordinate position
              top: 100, // Y-coordinate position
              scaleX: 0.5, // Scale horizontally (0.5 for 50%)
              scaleY: 0.5, // Scale vertically (0.5 for 50%)
              angle: -90,
              // fill: 'blue',    // Change fill color
              // stroke: 'red',   // Change stroke color
              // strokeWidth: 2,  // Change stroke width
            });

            console.log(svgElement);

            editor.canvas.add(svgElement); // Make sure editor.canvas is your Fabric.js canvas instance.
          } else {
            console.error("SVG parsing failed.");
          }
        });
      } else {
        // Just in case we don't work with SVGs?
        fabric.Image.fromURL(
          imageUrl,
          (img) => {
            img.set({ left: 10, top: 10 });
            img.scaleToWidth(100);
            img.scaleToHeight(100);
            editor.canvas.add(img);
            editor.canvas.renderAll();
          },
          { crossOrigin: "anonymous" }
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  // Adds an wall (image) to the canvas
  function addWallToCanvas(svgString) {
    return new Promise((resolve, reject) => {
      fabric.loadSVGFromString(svgString, function (results, options) {
        if (results && results[0]) {
          const svgElement = results[0];

          svgElement.set({
            left: 100, // X-coordinate position
            top: 100, // Y-coordinate position
            scaleX: 0.1, // Scale horizontally (0.25 for 25%)
            scaleY: 0.1, // Scale vertically (0.25 for 25%)
            angle: 0,
          });

          editor.canvas.add(svgElement); // Make sure editor.canvas is your Fabric.js canvas instance.
          resolve(svgElement);
        } else {
          console.error("SVG parsing failed.");
          reject("SVG parsing failed.");
        }
      });
    });
  }

  const oldGenerateMap = async () => {
    try {
      const imageUrl = "/wall.svg";
      fetchIMG(imageUrl)
        .then((svgString) => {
          console.log("Fetched SVG:", svgString);
        })
        .catch((error) => {
          console.error("Failed to fetch SVG:", error);
        });
      const extension = imageUrl.split(".").pop();

      const length = 5;
      const height = 5;

      if (extension === "svg") {
        var svgString =
          "<svg width='400px' height='400px' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' version='1.1'> <g><path d='M57.2461,75.0045 C57.2461,75.0045 102.605,89.8415 102.605,89.8415 C102.605,89.8415 55.5504,101.286 55.5504,101.286 C55.5504,101.286 62.7569,89.4175 62.7569,89.4175 C62.7569,89.4175 57.2461,75.0045 57.2461,75.0045 Z' style='stroke:none;fill-rule:evenodd;fill:#fc1997;fill-opacity:1;'/></g></svg>";
        svgString = await readSVGFile(imageUrl);
        console.log(svgString);

        for (let i = 0; i < length; i++) {
          for (let j = 0; j < height; j++) {
            addWallToCanvas(svgString)
              .then((svgElement) => {
                console.log("SVG element added to canvas:", svgElement);
                // You can continue working with svgElement here or chain further actions.
              })
              .catch((error) => {
                console.error("Error:", error);
              });

            break;
          }
          break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const saveMap = () => {
    const json = JSON.stringify(editor.canvas.toJSON());
    const jsonData = {
      svgData: json,
    };

    const apiUrl =
      "https://ec2-13-56-12-137.us-west-1.compute.amazonaws.com/api/saveMap";
    async function fetchData() {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "maps-api-key": "1234MAPS",
          },
          body: JSON.stringify(jsonData),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(`Server error: ${err.message}`);
        }

        const data = await response.json();
        console.log("Server response:", data.message);
      } catch (error) {
        console.error("Client or server error:", { error: error.message });
      }
    }
    fetchData();
  };
  const getMap = () => {
    const apiUrl =
      "https://ec2-13-56-12-137.us-west-1.compute.amazonaws.com/api/getMap";

    async function fetchData() {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "maps-api-key": "1234MAPS",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        editor.canvas.loadFromJSON(data.jsonData);
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchData();
  };

  const exportAsImage = () => {
    const dataURL = editor.canvas.toDataURL({
      format: "jpg",
      quality: 1,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas.jpg";
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Cleanup
  };
  const exportAsPDF = () => {
    const dataURL = editor.canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    const pdf = new jsPDF();
    pdf.addImage(dataURL, "PNG", 10, 10);
    pdf.save("canvas.pdf");
  };

  return (
    <div className="App">
      <h1>FabricJS React Sample</h1>
      <button onClick={onAddCircle}>Add Circle</button>
      <button onClick={onAddRectangle} disabled={!cropImage}>
        Add Rectangle
      </button>
      <button onClick={addText} disabled={!cropImage}>
        Add Text
      </button>
      <button onClick={addImage} disabled={!cropImage}>
        Add Image
      </button>
      <button onClick={oldGenerateMap} disabled={!cropImage}>
        Generate Map
      </button>
      <button onClick={toggleDraw} disabled={!cropImage}>
        Toggle draw
      </button>
      <button onClick={clear} disabled={!cropImage}>
        Clear
      </button>
      <button onClick={undo} disabled={!cropImage}>
        Undo
      </button>
      <button onClick={redo} disabled={!cropImage}>
        Redo
      </button>
      <button onClick={toggleSize} disabled={!cropImage}>
        ToggleSize
      </button>
      <button onClick={removeSelectedObject} disabled={!cropImage}>
        Delete
      </button>
      <button onClick={(e) => setCropImage(!cropImage)}>Crop</button>
      <label disabled={!cropImage}>
        <input
          disabled={!cropImage}
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>
      <button onClick={exportAsImage} disabled={!cropImage}>
        Export as Image
      </button>
      <button onClick={exportAsPDF} disabled={!cropImage}>
        Export as PDF
      </button>
      <button onClick={fromSvg} disabled={!cropImage}>
        fromsvg
      </button>
      <button onClick={saveMap} disabled={!cropImage}>
        Save Map
      </button>
      <button onClick={getMap} disabled={!cropImage}>
        Get Map
      </button>
      <button onClick={drawPoints} disabled={!cropImage}>
        Draw Points
      </button>

      <div
        style={{
          border: `3px ${!cropImage ? "dotted" : "solid"} Green`,
          width: "500px",
          height: "500px",
        }}
      >
        <FabricJSCanvas className="sample-canvas" onReady={onReady} />
      </div>
    </div>
  );
}
