"use client";
import React, { ReactNode, useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

const LenisProvider = ({children}: {children: ReactNode}) => {

      useEffect(() => {
      // Initialize Lenis
       const lenis = new Lenis({
          autoRaf: true,
       });

      lenis.on("scroll", (e) => {
        //  console.log(e);
       });


  }, [])

  return children;
}

export default LenisProvider