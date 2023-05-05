import { useEffect, useRef, useState } from "react";
import { REDUCER_ACTION_TYPE } from "../utils/reducer";
const Extractor = ({ image, dispatch, setExtractedColor }: any) => {
  const canvasRef = useRef() as any;
  const [canvasLoaded, setCanvasLoaded] = useState(false);

  useEffect(() => {
    if (canvasLoaded && image) {
      const APP: any = {
        canvas: null,
        ctx: null,
        data: [],
        img: null,
        init() {
          APP.canvas = canvasRef.current;
          APP.ctx = APP.canvas.getContext("2d");
          // APP.canvas.width = 200;
          // APP.canvas.style.width = 200;
          // APP.canvas.height = 200;
          // APP.canvas.style.height = 200;
          APP.img = document.createElement("img");
          APP.img.crossOrigin = "Anonymous";
          APP.img.src = image;

          // set the object-fit property of the image element to "contain"
          APP.img.style.objectFit;

          // add the image element to the container element
          APP.canvas.appendChild(APP.img);
          //once the image is loaded, add it to the canvas

          APP.img.onload = (ev: any) => {
            const scale = 0.35;
            const newWidth = APP.img.width * scale;
            const newHeight = APP.img.height * scale;
            APP.canvas.width = newWidth;
            APP.canvas.style.width = newWidth + "px";
            APP.canvas.height = newHeight;
            APP.canvas.style.height = newHeight + "px";
            APP.ctx.drawImage(APP.img, 0, 0, newWidth, newHeight);
            APP.canvas.style.borderRadius = "20px";

            //call the context.getImageData method to get the array of [r,g,b,a] values
            let imgDataObj = APP.ctx.getImageData(
              0,
              0,
              APP.canvas.width,
              APP.canvas.height
            );

            if (APP.canvas) {
              APP.data = imgDataObj.data; //data prop is an array
              // console.log(APP.data.length, 900 * 600 * 4); //  has 2,160,000 elements
              APP.canvas.addEventListener("mousemove", APP.getPixel);
              APP.canvas.addEventListener("click", APP.addBox);
            }
          };
        },

        getPixel(ev: any) {
          const scale = 0.35;
          const newWidth = APP.img.width * scale;
          const newHeight = APP.img.height * scale;
          APP.canvas.width = newWidth;
          //as the mouse moves around the image
          // let canvas = ev.target;
          let cols = newWidth;
          // let rows = canvas.height;
          let { offsetX, offsetY } = ev;
          //call the method to get the r,g,b,a values for current pixel
          let c = APP.getPixelColor(cols, offsetY, offsetX);
          //build a colour string for css
          let clr = `rgb(${c.red}, ${c.green}, ${c.blue})`; //${c.alpha / 255}
          const pixelColorElem = document.getElementById("pixelColor");
          if (pixelColorElem !== null) {
            pixelColorElem.style.backgroundColor = clr;
          }

          //save the string to use elsewhere
          APP.pixel = clr;
          //now get the average of the surrounding pixel colors
          APP.getAverage(ev);
        },
        getAverage(ev: any) {
          const scale = 0.35;
          const newWidth = APP.img.width * scale;
          const newHeight = APP.img.height * scale;
          APP.canvas.width = newWidth;
          APP.canvas.height = newHeight;
          //create a 41px by 41px average colour square
          //replace everything in the canvas with the original image
          // let canvas = ev.target;
          let cols = newWidth;
          let rows = newHeight;
          //remove the current contents of the canvas to draw the image and box again
          APP.ctx.clearRect(0, 0, cols, rows);
          //add the image from memory
          APP.ctx.drawImage(APP.img, 0, 0, newWidth, newHeight);
          let { offsetX, offsetY } = ev;
          const inset = 20;
          //inset by 20px as our workable range
          offsetX = Math.min(offsetX, cols - inset);
          offsetX = Math.max(inset, offsetX);
          offsetY = Math.min(offsetY, rows - inset);
          offsetY = Math.max(offsetY, inset);
          //create a 41 x 41 pixel square for the average
          let reds = 0; //total for all the red values in the 41x41 square
          let greens = 0;
          let blues = 0;
          //for anything in the range (x-20, y-20) to (x+20, y+20)
          for (let x = -1 * inset; x <= inset; x++) {
            for (let y = -1 * inset; y <= inset; y++) {
              let c = APP.getPixelColor(cols, offsetY + y, offsetX + x);
              reds += c.red;
              greens += c.green;
              blues += c.blue;
            }
          }
          let nums = 21 * 21; //total number of pixels in the box
          let red = Math.round(reds / nums);
          let green = Math.round(greens / nums);
          let blue = Math.round(blues / nums);
          //create a colour string for the average colour
          let clr = `rgb(${red}, ${green}, ${blue})`;
          //now draw an overlaying square of that colour
          //make the square twice as big as the sample area
          APP.ctx.fillStyle = APP.pixel;
          APP.ctx.strokeStyle = "#FFFFFF";
          APP.ctx.strokeWidth = 2;
          //save the average colour for later
          APP.average = clr;
          APP.ctx.strokeRect(offsetX - inset, offsetY - inset, 21, 21);
          APP.ctx.fillRect(offsetX - inset, offsetY - inset, 21, 21);
        },
        getPixelColor(cols: any, x: number, y: number) {
          //see grid.html as reference for this algorithm
          let pixel = cols * x + y;
          let arrayPos = pixel * 4;
          return {
            red: APP.data[arrayPos],
            green: APP.data[arrayPos + 1],
            blue: APP.data[arrayPos + 2],
            alpha: APP.data[arrayPos + 3],
          };
        },
        addBox(ev: any) {
          //user clicked. Let's add boxes below with the pixel and the average
          let colors = document.querySelector(".colors");
          let pixel = document.createElement("span");
          pixel.className = "box";
          pixel.setAttribute("data-label", "Exact pixel");
          pixel.setAttribute("data-color", APP.pixel);

          let average = document.createElement("span");
          average.className = "box";
          average.setAttribute("data-label", "Average");
          average.setAttribute("data-color", APP.average);

          pixel.style.backgroundColor = APP.pixel;
          average.style.backgroundColor = APP.average;
          colors?.append(pixel, average);

          const averageColor = average.style.backgroundColor;

          dispatch({
            type: REDUCER_ACTION_TYPE.SET_EXTRACTED_COLOR,
            payload: APP.pixel.replace(/\s/g, ""),
          });
        },
      };
      APP.init();
    } else {
    }
  }, [canvasLoaded, image, dispatch]);

  return (
    <main className={`relative`}>
      <p>
        <span id="pixelColor" data-label="Current Pixel"></span>
        <canvas
          width="900"
          ref={(e) => {
            canvasRef.current = e;
            setCanvasLoaded(true);
          }}
        ></canvas>
      </p>

      {/* <div
        style={{ background: `${extractedColor}` }}
        className={` w-[50px] outline outline-black outline-2 h-[50px] bottom-[800px] absolute left-[500px]`}
      ></div> */}
    </main>
  );
};
export default Extractor;
