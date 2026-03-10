import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import image1 from "@/assets/diego/image1.jpeg";
import image2 from "@/assets/diego/image2.jpeg";
import image3 from "@/assets/diego/image3.jpeg";
import image4 from "@/assets/diego/image4.jpeg";
import image5 from "@/assets/diego/image5.jpeg";
import c418 from "@/assets/audio/C418.mp3";

const images = [image1, image2, image3, image4, image5];
const INTERVAL_MS = 5000;

export default function Clock() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [time, setTime] = useState(new Date());
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play audio on load
    const audio = new Audio(c418);
    audio.loop = true;
    audioRef.current = audio;

    // Try playing, but handle autoplay policy restrictions
    audio.play()
      .then(() => setIsAudioPlaying(true))
      .catch((err) => {
        console.warn("Autoplay blocked. User needs to interact.", err);
        setIsAudioPlaying(false);
      });

    // Update time every second
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      audio.pause();
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const dayName = time.toLocaleDateString("en-US", { weekday: "long" });
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const year = time.getFullYear();

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsAudioPlaying(true))
          .catch(console.error);
      }
    }
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row h-screen w-screen bg-black font-sans">
      {/* Top/Left section - Image slideshow (Bottom on Mobile) */}
      <div className="relative h-1/2 w-full lg:h-full lg:w-1/2 overflow-hidden bg-black">
        {images.map((img, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === (currentIndex - 1 + images.length) % images.length;

          return (
            <img
              key={index}
              src={img}
              alt="Slideshow"
              style={{
                transition: isActive || isPrev
                  ? "opacity 1s ease-in-out, transform 10s linear"
                  : "opacity 1s ease-in-out",
              }}
              className={`absolute inset-0 h-full w-full object-fill ${isActive ? "opacity-100" : "opacity-0"
                } ${isActive || isPrev ? "scale-110" : "scale-100"}`}
            />
          );
        })}
      </div>

      {/* Bottom/Right section - Clock info (Top on Mobile) */}
      <div className="relative flex h-1/2 w-full lg:h-full lg:w-1/2 flex-col items-center justify-center bg-zinc-950 text-white">

        {/* Simple modern digital clock */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-baseline font-light tracking-tight tabular-nums">
            <span className="text-6xl sm:text-8xl lg:text-[10rem]">{hours}</span>
            <span className="mx-1 sm:mx-2 animate-pulse text-4xl sm:text-6xl lg:text-8xl text-zinc-600">:</span>
            <span className="text-6xl sm:text-8xl lg:text-[10rem]">{minutes}</span>
            <span className="ml-2 sm:ml-4 text-2xl sm:text-4xl lg:text-6xl text-zinc-500">{seconds}</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 text-zinc-400">
            <span className="text-lg sm:text-2xl font-medium uppercase tracking-[0.2em] text-center">
              {dayName}
            </span>
            <div className="h-1 w-1 rounded-full bg-zinc-600 shrink-0" />
            <span className="text-lg sm:text-2xl font-light tracking-widest">{year}</span>
          </div>
        </div>

        {/* Audio toggle button */}
        <button
          onClick={toggleAudio}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 rounded-full border border-zinc-800 bg-zinc-900/50 p-3 sm:p-4 text-zinc-400 backdrop-blur-md transition-all hover:scale-110 hover:bg-zinc-800 hover:text-white"
          aria-label={isAudioPlaying ? "Mute audio" : "Play audio"}
        >
          {isAudioPlaying ? <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" /> : <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" />}
        </button>
      </div>
    </div>
  );
}
