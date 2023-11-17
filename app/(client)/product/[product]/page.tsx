"use client"
import React, { useState,ChangeEvent,useRef,useEffect } from 'react';

import { useParams } from 'next/navigation'
import ImageNext from "next/image";
import { productHeroImages } from "@/constant/productsHeroImages";
import { Circle } from "lucide-react";
import SizeAndQCard from "@/components/global/SizeAndQCard";
import { Button } from "@/components/ui/button";
type Props = {
};





function Page({}: Props) {
    const params = useParams();
    const [image, setImage] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);


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
            const radius = 15;
    
            // Center the image on the canvas
            let drawX = 0;
            let drawY = (canvas.height - drawHeight) / 2;
    
            context.drawImage(img, drawX+radius, drawY+radius, drawWidth-radius*2, drawHeight-radius*2);
    
            // Draw a circle at each colored pixel
            const imageData = context.getImageData(drawX, drawY, drawWidth, drawHeight);
            for (let i = 0; i < imageData.data.length; i += 4) {
              // Check if the pixel is colored
              if (imageData.data[i + 3] === 255) {
                const x = (i / 4) % drawWidth;
                const y = Math.floor(i / 4 / drawWidth);
    
                // Draw a circle at the colored pixel
                context.beginPath();
                context.arc(drawX + x, drawY + y, radius, 0, 2 * Math.PI);
                context.fillStyle = 'white'; // Change the color if needed
                context.fill();
                context.closePath();
              }
            }
            context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          };
    
          img.onerror = (error) => {
            console.error("Error loading image:", error);
          };
        }
      }
    }, [image, canvasRef.current]);
    
    


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
  
      if (file) {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          const imageDataUrl = reader.result as string;
          setImage(imageDataUrl);
        };
  
        reader.readAsDataURL(file);
      }
    };
  
  return (
    <div className="">
      <div className=" bg-secondary gap-6">
        <div className="flex container  py-6 mx-auto  gap-4 items-center ">
          <ImageNext src={productHeroImages[params?.product as keyof typeof productHeroImages]} alt="" width={350} height={350} className="drop-shadow-xl"></ImageNext>
          <div className="space-y-4">
          <h1 className="text-6xl">{params?.product} stickers</h1>
          <p className="max-w-2xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem perspiciatis similique omnis maxime corporis. Aliquid modi hic sapiente, nobis, ipsa quod nisi tenetur non deleniti dolor temporibus explicabo quibusdam laboriosam.</p>
          </div>
        </div>
      </div>
              <input type="file" />
      <div className="flex gap-6 container mx-auto py-8">
        <div className="flex-1 bg-secondary border rounded-2xl flex justify-center items-center">
              {/* <Button size={"lg"}>Upload sticker</Button> */}
              <input type="file" onChange={handleImageChange} />
                {image && <img className='hidden' src={image} alt="Selected" style={{ maxWidth: '100%' }} />}
                {image && (
                  <canvas
                    width={500} // Set the desired canvas width
                    height={500} // Set the desired canvas height
                    style={{ border: '1px solid #000' }}
                    ref={canvasRef}
                  ></canvas>
                )}
            </div>
        <SizeAndQCard />
      </div>
    </div>
  );
}

export default Page;
