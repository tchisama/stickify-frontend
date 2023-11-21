"use client"
import React, { useState,ChangeEvent,useRef,useEffect } from 'react';

import { Circle, Menu, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { productHeroImages } from '@/constant/productsHeroImages';
import CanvasButtons from './CanvasButtons';
import { useCanvasProps } from '@/store/canvasProps';
import { useSizeAndQ } from '@/store/sizeAndQ';
type Props = {
    type : keyof typeof productHeroImages
}



const quality = 1 
function drawImageWithMargin(  
    context: CanvasRenderingContext2D,
    img: HTMLImageElement,
    drawX: number,
    drawY: number,
    drawWidth: number,
    drawHeight: number,
    margin: number) {
    const aspectRatio = img.width / img.height;
    const newWidth = drawWidth - 2 * (margin*quality);
    const newHeight = newWidth / aspectRatio;

    const newX = drawX + (drawWidth - newWidth) / 2;
    const newY = drawY + (drawHeight - newHeight) / 2;

    context.drawImage(img, newX, newY, newWidth, newHeight);
}



function Canvas({type}: Props) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {color,setColor,radius,setRadius,image, setImage,setFile} = useCanvasProps()
    const {size} = useSizeAndQ()

    useEffect(() => {
        setRadius(
        type==="die-cut"?20: 
        type === "circle" ?80:
        type === "square" ? 40:
        type === "rect" ? 100:
        type === "bumper" ? 100:
        0
        )
    },[setRadius,type])


    useEffect(() => {
      if (image && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
    
        if (context) {
          const img = new Image();
          img.src = image;
    
          img.onload = () => {
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
    
            // Draw the image on the canvas
            const aspectRatio = img.width / img.height;
            let drawWidth = canvas.width;
            let drawHeight = canvas.width / aspectRatio;
    
            // Center the image on the canvas
            let drawX = 0;
            let drawY = (canvas.height - drawHeight) / 2;

            if(type=="die-cut"){
                drawImageWithMargin(context, img, drawX, drawY, drawWidth, drawHeight, radius);
                // Draw a circle at each colored pixel
                const imageData = context.getImageData(drawX, drawY, drawWidth, drawHeight);
                for (let i = 0; i < imageData.data.length; i += 4*4) {
                // Check if the pixel is colored
                if (imageData.data[i + 3] === 255) {
                    const x = (i / 4) % drawWidth;
                    const y = Math.floor(i / 4 / drawWidth);
        
                    // Draw a circle at the colored pixel
                    context.beginPath();
                    context.arc(drawX + x, drawY + y, radius, 0, 2 * Math.PI);
                    context.fillStyle = color; // Change the color if needed
                    context.fill();
                    context.closePath();
                }
                }
                drawImageWithMargin(context, img, drawX, drawY, drawWidth, drawHeight, radius);
            }else if(type=="circle"){
                context.beginPath();
                context.arc(canvas.width / 2,canvas.height / 2, canvas.width/2, 0, 2 * Math.PI);
                context.fillStyle = color; // Change the color if needed
                context.fill();
                context.closePath();
                drawImageWithMargin(context, img, drawX, drawY, drawWidth, drawHeight,radius);
            }else if(type=="square"){
                context.fillStyle = color; // Change the color if needed
                context.rect(0, 0, canvas.width, canvas.height);
                context.fill();
                context.closePath();
                drawImageWithMargin(context, img, drawX, drawY, drawWidth, drawHeight,radius);
            }else if(type=="rect"){
                context.fillStyle = color; // Change the color if needed
                context.rect(0, 0, canvas.width, canvas.height);
                context.fill();
                context.closePath();
                drawImageWithMargin(context, img, drawX, drawY, drawWidth, drawHeight,radius);
            }else if(type=="bumper"){
                context.fillStyle = color; // Change the color if needed
                context.rect(0, 0, canvas.width, canvas.height);
                context.fill();
                context.closePath();
                drawImageWithMargin(context, img, drawX, drawY, drawWidth, drawHeight,radius);
            }





          };
    
          img.onerror = (error) => {
            console.error("Error loading image:", error);
          };
        }
      }
    }, [image, canvasRef,radius,color,type]);
    
    


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFile(file);
        const reader = new FileReader();
  
        reader.onloadend = () => {
          const imageDataUrl = reader.result as string;
          setImage(imageDataUrl);
        };
  
        reader.readAsDataURL(file);
      }
    };
  return (

            <>
        <div className="flex-1 min-h-[500px] bg-secondary overflow-hidden relative border rounded-2xl group flex flex-col-reverse justify-center items-center">
                        {/* <input type="range" min="0" max="150" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} /> */}
                          <input className='hidden' type="file" accept='image/*' id='upload' onChange={handleImageChange} />
                  {
                        !image &&
                        <Label htmlFor='upload' className='cursor-pointer px-8 flex gap-2 border shadow py-4 text-lg bg-white rounded-xl'>
                          Upload sticker
                            <Upload/>
                        </Label>
                  }
                {(image &&
                    <>
                    <CanvasButtons/>
                  <canvas
                    width={(600)*.8} // Set the desired canvas width
                    height={(type=="rect"? 400: type=="bumper"? 200 : 600)*.8} // Set the desired canvas height
                    className='p-4 w-[500px] drop-shadow-xl '
                    ref={canvasRef}
                  ></canvas>
                  <div style={{width:(600*.8) + "px"}} className='h-[50px] opacity-60 left-[50%] translate-x-[-50%] top-0 absolute py-4 flex   justify-between'>
                      {
                         new Array(size.split("x").map(Number)[0]+1).fill(0).map((_,q) => (
                          <>
                          {
                            q!==0 && size!=="20x20" &&
                            new Array(1) .fill(0).map((_,q2) => (
                              <div key={q2} className='text-[6px]'>|</div>
                            ))
                          }
                          <div className={"text-xs flex  flex-col gap-2 items-center"} key={q}>
                            <div>|</div>
                          {q}
                          </div>
                          </>
                        ))
                      }
                  </div>
                    </>
                )}
            </div>
            </>
  )
}

export default Canvas