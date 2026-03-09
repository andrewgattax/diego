import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import diego from "@/assets/diego.png";
import bianco from "@/assets/blanco.png";
import flashbangAudio from "@/assets/audio/flashbang.mp3";

interface DiegoContextValue {
  flash: () => void;
  startDiego: () => void;
  showClock: boolean;
}

const DiegoContext = createContext<DiegoContextValue | null>(null);

export function DiegoProvider({ children }: { children: ReactNode }) {
  const [opacity, setOpacity] = useState(0);
  const [image, setImage] = useState(diego);
  const [showClock, setShowClock] = useState(false);
  const [imgTransition, setImgTransition] = useState("none");

  const flash = useCallback(() => {
    setOpacity(1);
    setTimeout(() => {
      setOpacity(0);
    }, 70);
  }, []);

  const wiggleAndBoom = () => {

    let counter = 0;
    const wiggleDuration = 1000;
    const intervalDuration = 10;
    const wiggleIntervals = wiggleDuration / intervalDuration;

    const intervalId = setInterval(() => {
      if (counter < wiggleIntervals) {
        setOpacity(Math.random() * 0.15);
        counter++;
      } else {
        setOpacity(0);
        setTimeout(() => {
          setOpacity(1);
          new Audio(flashbangAudio).play();
          setTimeout(() => {
            setImage(bianco);
            // here


            // Keep solid white for 1 second before fading
            setTimeout(() => {
              setShowClock(true);
              setImgTransition("opacity 4s ease-out");
              setOpacity(0);
              setTimeout(() => {
                setImgTransition("none");
              }, 4000);
            }, 2000);
          }, 250);
        }, 1000);
        clearInterval(intervalId);
        setOpacity(0);
      }
    }, intervalDuration);
  }

  const startDiego = useCallback(() => {
    setTimeout(() => {
      flash()
      setTimeout(() => {
        wiggleAndBoom()
      }, 2000)
    }, 1000)
  }, []);

  return (
    <DiegoContext.Provider value={{ flash, startDiego, showClock }}>
      {children}
      <div
        className={`fixed inset-0 z-9999 h-screen w-screen ${opacity === 0 ? "pointer-events-none" : ""}`}
      >
        <img
          src={image}
          alt="Diego"
          className="h-full w-full object-fill"
          style={{ opacity, transition: imgTransition }}
        />
      </div>
    </DiegoContext.Provider>
  );
}

export function useDiego(): DiegoContextValue {
  const context = useContext(DiegoContext);
  if (!context) {
    throw new Error("useDiego must be used within a DiegoProvider");
  }
  return context;
}
