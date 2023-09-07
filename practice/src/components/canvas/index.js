import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import BackgroundImage from '../../assets/background-image.jpg';
import "./styles.css";

export default function App() {
  const { editor, onReady } = useFabricJSEditor();

  const history = [];
  const [color, setColor] = useState("#35363a");
  const [cropImage, setCropImage] = useState(true);

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }

    if (cropImage) {
      editor.canvas.__eventListeners = {};
      return;
    }

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

    editor.canvas.renderAll();
  }, [editor]);

  const addBackground = () => {
    if (!editor || !fabric) {
      return;
    }

    // fabric.Image.fromURL(
    //   "https://thegraphicsfairy.com/wp-content/uploads/2019/02/Anatomical-Heart-Illustration-Black-GraphicsFairy.jpg",
    //   (image) => {
    //     editor.canvas.setBackgroundImage(
    //       image,
    //       editor.canvas.renderAll.bind(editor.canvas)
    //     );
    //   }
    // );

    editor.canvas.setBackgroundImage(BackgroundImage, editor.canvas.renderAll.bind(editor.canvas));
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

  const toggleDraw = () => {
    editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
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
    
  const addImage = async () => {
    try {
      const imageUrl = "/wall.svg";
      fetchIMG(imageUrl)
        .then(svgString => {
          console.log("Fetched SVG:", svgString);
        })
        .catch(error => {
          console.error("Failed to fetch SVG:", error);
        });
      const extension = imageUrl.split('.').pop();
  
      if (extension === "svg") {
        var svgString = "<svg width='400px' height='400px' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' version='1.1'> <g><path d='M57.2461,75.0045 C57.2461,75.0045 102.605,89.8415 102.605,89.8415 C102.605,89.8415 55.5504,101.286 55.5504,101.286 C55.5504,101.286 62.7569,89.4175 62.7569,89.4175 C62.7569,89.4175 57.2461,75.0045 57.2461,75.0045 Z' style='stroke:none;fill-rule:evenodd;fill:#fc1997;fill-opacity:1;'/></g></svg>";
        svgString = await readSVGFile(imageUrl);
        console.log(svgString);
        
        fabric.loadSVGFromString(svgString, function(results, options) {
          if (results && results[0]) {
            const svgElement = results[0];
            
            svgElement.set({
              left: 100,       // X-coordinate position
              top: 100,        // Y-coordinate position
              scaleX: 0.5,     // Scale horizontally (0.5 for 50%)
              scaleY: 0.5,     // Scale vertically (0.5 for 50%)
              angle: -90,
              // fill: 'blue',    // Change fill color
              // stroke: 'red',   // Change stroke color
              // strokeWidth: 2,  // Change stroke width
            });

            console.log(svgElement);
            
            editor.canvas.add(svgElement);  // Make sure editor.canvas is your Fabric.js canvas instance.
          } else {
            console.error("SVG parsing failed.");
          }
        });
      } else {
        fabric.Image.fromURL(imageUrl, img => {
          img.set({ left: 10, top: 10 });
          img.scaleToWidth(100);
          img.scaleToHeight(100);
          editor.canvas.add(img);
          editor.canvas.renderAll();
        }, { crossOrigin: 'anonymous' });
      }
    } catch (e) {
      console.log(e);
    }
  };

  function addWallToCanvas(svgString) {
    return new Promise((resolve, reject) => {
      fabric.loadSVGFromString(svgString, function(results, options) {
        if (results && results[0]) {
          const svgElement = results[0];
  
          svgElement.set({
            left: 100,       // X-coordinate position
            top: 100,        // Y-coordinate position
            scaleX: 0.1,    // Scale horizontally (0.25 for 25%)
            scaleY: 0.1,    // Scale vertically (0.25 for 25%)
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

  const generateMap = async () => {
    try {
      const imageUrl = "/wall.svg";
      fetchIMG(imageUrl)
        .then(svgString => {
          console.log("Fetched SVG:", svgString);
        })
        .catch(error => {
          console.error("Failed to fetch SVG:", error);
        });
      const extension = imageUrl.split('.').pop();

      const length = 5;
      const height = 5;
  
      if (extension === "svg") {
        var svgString = "<svg width='400px' height='400px' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' version='1.1'> <g><path d='M57.2461,75.0045 C57.2461,75.0045 102.605,89.8415 102.605,89.8415 C102.605,89.8415 55.5504,101.286 55.5504,101.286 C55.5504,101.286 62.7569,89.4175 62.7569,89.4175 C62.7569,89.4175 57.2461,75.0045 57.2461,75.0045 Z' style='stroke:none;fill-rule:evenodd;fill:#fc1997;fill-opacity:1;'/></g></svg>";
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
  
  const saveSVG = () => {
    const json = editor.canvas.toJSON();
    const jsonString = JSON.stringify(json);
    console.log(json);
    console.log(jsonString);
    
    fetch('http://ec2-13-56-115-177.us-west-1.compute.amazonaws.com:8080/api/hello')
    .then((response) => response.json())
    .then((data) => console.log('API Response:', data.message))
    .catch((error) => console.error('Error:', error));
  }
  // const loadSVG = () => {
  //   const jsonString = /* fetch from your database */
  //   editor.canvas.loadFromJSON(JSON.parse(jsonString), editor.canvas.renderAll.bind(editor.canvas));
  // }

  const exportSVG = () => {
    const svg = editor.canvas.toSVG();
    console.info(svg);
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
      <button onClick={generateMap} disabled={!cropImage}>
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
      <button onClick={exportSVG} disabled={!cropImage}>
        {" "}
        ToSVG
      </button>
      <button onClick={fromSvg} disabled={!cropImage}>
        fromsvg
      </button>
      <button onClick={saveSVG} disabled={!cropImage}>
        Save
      </button>

      <div
        style={{
          border: `3px ${!cropImage ? "dotted" : "solid"} Green`,
          width: "500px",
          height: "500px"
        }}
      >
        <FabricJSCanvas className="sample-canvas" onReady={onReady} />
      </div>
    </div>
  );
}
