"use client"
import React, { useEffect } from 'react'
import { SheetItem, useSheet } from '@/store/customSheet'
import fitContainer, { PlacedElement } from '@/lib/itemsSheetfitter'
import Image from 'next/image'

type Props = {
    w:number
}

export default function RenderSheet({w}: Props) {
    // flating the sheet
    const [finalSheet,setFinalSheet] = React.useState<SheetItem[]>([])
    const {sheet,setSheet,setSelectedSticker,selectedSticker} = useSheet()
    const [process,setProcess] = React.useState<PlacedElement[]>([])
    const [cm,setCm] = React.useState(0)
    useEffect(() => {
        if(w!==0 && sheet.length>0){
        // flat sheet all quantity = 1 , 
        const  flat:SheetItem[] = []
        sheet.forEach((item,i) => {
            for(let i=0;i<item.quantity;i++){
                flat.push({...item,quantity:1,size:item.size*w/22-0})
            }
        })
        setFinalSheet(flat)
            const Cm = w/22
            setCm(w/22)
            setProcess(fitContainer(22*Cm,40*Cm,flat))
        }
    },[sheet,w])

    return(
    process.map((item,i) => <div onClick={()=>setSelectedSticker(item.id)} key={i} className={'absolute rounded m-0 p-1'} style={{width:item.width +"px",height:item.height +"px",top:item.y ,left:item.x}}>
        <Image width={item.width} height={item.height} src={item.image} alt="" className={'w-full hover:bg-[#0000001a] border cursor-pointer rounded-md duration-200 p-2'+ (selectedSticker == item.id? " z-10 outline  outline-secondary":"")} />
    </div>)
    )
}