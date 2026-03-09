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
    <div className="flex h-screen w-screen bg-black">
      {/* Left column - Image slideshow */}
      <div className="relative h-full w-1/2 overflow-hidden">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Slideshow"
            className={`absolute inset-0 h-full w-full object-fill transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}
      </div>

      {/* Right column - Clock info */}
      <div className="flex h-full w-1/2 flex-col items-center justify-center text-white">
        <div className="text-9xl font-thin tabular-nums">
          {hours}:{minutes}:{seconds}
        </div>
        <div className="mt-4 text-4xl font-light text-gray-400">
          {dayName}
        </div>
        <div className="mt-2 text-2xl font-light text-gray-500">
          {year}
        </div>
      </div>

      {/* Audio toggle button */}
      <button
        onClick={toggleAudio}
        className="absolute bottom-8 right-8 z-10 rounded-full bg-white/5 p-4 text-white/50 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md"
        aria-label={isAudioPlaying ? "Mute audio" : "Play audio"}
      >
        {isAudioPlaying ? <Volume2 className="h-8 w-8" /> : <VolumeX className="h-8 w-8" />}
      </button>
    </div>
  );
}
