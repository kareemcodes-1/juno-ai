"use client"
import { SectionCards } from "@/components/section-cards"
import { useParams } from "next/navigation"


export default function Page() {
  const {url} = useParams()
  return (

      <SectionCards workspace={url as string}/>
 
  )
}
