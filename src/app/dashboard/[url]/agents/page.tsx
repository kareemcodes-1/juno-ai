"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useParams } from "next/navigation"


export default function Page() {
  const {url} = useParams()
  return (

      <SectionCards workspace={url as string}/>
 
  )
}
