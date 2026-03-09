import diego from "@/assets/diego.png";
import { useState, useEffect } from "react";
import {Button} from "@/components/ui/button.tsx";

export default function Diego() {

  const [opacity, setOpacity] = useState(0.0);

  // useEffect(() => {
  //   startDiego();
  // }, []);

  // const startDiego = () => {
  //   const duration = 1000; // 1 second fade in
  //   const steps = 60;
  //   const increment = 1 / steps;
  //   const interval = duration / steps;
  //
  //   let currentOpacity = 0;
  //   const timer = setInterval(() => {
  //     currentOpacity += increment;
  //     if (currentOpacity >= 1) {
  //       setOpacity(1);
  //       clearInterval(timer);
  //     } else {
  //       setOpacity(currentOpacity);
  //     }
  //   }, interval);
  // }

  const flash = () => {
    setOpacity(1);

    const timer = setTimeout(() => {
      setOpacity(0);
    }, 10);
  }

  return (
    <div className="fixed inset-0 z-9999 h-screen w-screen" style={{ display: opacity === 0 ? 'none' : 'block' }}>
      <img
        src={diego}
        alt="Diego"
        className="h-full w-full object-fill"
        style={{ opacity }}
      />
    </div>
  );
}
