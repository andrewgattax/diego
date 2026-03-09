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
    <div className="flex h-screen w-screen bg-black font-sans">
      {/* Left column - Image slideshow */}
      <div className="relative h-full w-1/2 overflow-hidden bg-black">
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

      {/* Right column - Clock info */}
      <div className="relative flex h-full w-1/2 flex-col items-center justify-center bg-zinc-950 text-white">

        {/* Simple modern digital clock */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-baseline font-light tracking-tight tabular-nums">
            <span className="text-8xl md:text-[10rem]">{hours}</span>
            <span className="mx-2 animate-pulse text-6xl md:text-8xl text-zinc-600">:</span>
            <span className="text-8xl md:text-[10rem]">{minutes}</span>
            <span className="ml-4 text-4xl md:text-6xl text-zinc-500">{seconds}</span>
          </div>

          <div className="flex items-center space-x-4 text-zinc-400">
            <span className="text-2xl font-medium uppercase tracking-[0.2em]">
              {dayName}
            </span>
            <div className="h-1 w-1 rounded-full bg-zinc-600" />
            <span className="text-2xl font-light tracking-widest">{year}</span>
          </div>
        </div>

        {/* Audio toggle button */}
        <button
          onClick={toggleAudio}
          className="absolute bottom-8 right-8 z-20 rounded-full border border-zinc-800 bg-zinc-900/50 p-4 text-zinc-400 backdrop-blur-md transition-all hover:scale-110 hover:bg-zinc-800 hover:text-white"
          aria-label={isAudioPlaying ? "Mute audio" : "Play audio"}
        >
          {isAudioPlaying ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}
