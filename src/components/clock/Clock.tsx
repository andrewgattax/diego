"use client"

import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

const image1 = "/diego/image1.jpeg";
const image2 = "/diego/image2.jpeg";
const image3 = "/diego/image3.jpeg";
const image4 = "/diego/image4.jpeg";
const image5 = "/diego/image5.jpeg";
const image6 = "/diego/image6.jpeg";

const images = [image1, image2, image3, image4, image5, image6];
const INTERVAL_MS = 5000;
const AUDIO_SRC = "/audio/C418.mp3";

export default function Clock() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [time, setTime] = useState(new Date());
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audioRef.current = audio;

    audio
      .play()
      .then(() => setIsAudioPlaying(true))
      .catch((err) => {
        console.warn("Autoplay blocked. User needs to interact.", err);
        setIsAudioPlaying(false);
      });

    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      audio.pause();
      audioRef.current = null;
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
    if (!audioRef.current) return;

    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
      return;
    }

    audioRef.current
      .play()
      .then(() => setIsAudioPlaying(true))
      .catch(console.error);
  };

  return (
    <div className="flex h-screen w-screen flex-col-reverse bg-black font-sans lg:flex-row">
      <div className="relative h-1/2 w-full overflow-hidden bg-black lg:h-full lg:w-1/2">
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
              className={`absolute inset-0 h-full w-full object-fill ${
                isActive ? "opacity-100" : "opacity-0"
              } ${isActive || isPrev ? "scale-110" : "scale-100"}`}
            />
          );
        })}
      </div>

      <div className="relative flex h-1/2 w-full flex-col items-center justify-center bg-zinc-950 text-white lg:h-full lg:w-1/2">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-baseline font-light tracking-tight tabular-nums">
            <span className="text-6xl sm:text-8xl lg:text-[10rem]">{hours}</span>
            <span className="mx-1 animate-pulse text-4xl text-zinc-600 sm:mx-2 sm:text-6xl lg:text-8xl">
              :
            </span>
            <span className="text-6xl sm:text-8xl lg:text-[10rem]">{minutes}</span>
            <span className="ml-2 text-2xl text-zinc-500 sm:ml-4 sm:text-4xl lg:text-6xl">
              {seconds}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-zinc-400 sm:space-x-4">
            <span className="text-center text-lg font-medium uppercase tracking-[0.2em] sm:text-2xl">
              {dayName}
            </span>
            <div className="h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
            <span className="text-lg font-light tracking-widest sm:text-2xl">
              {year}
            </span>
          </div>
        </div>

        <button
          onClick={toggleAudio}
          className="fixed bottom-4 right-4 z-50 rounded-full border border-zinc-800 bg-zinc-900/50 p-3 text-zinc-400 backdrop-blur-md transition-all hover:scale-110 hover:bg-zinc-800 hover:text-white sm:bottom-8 sm:right-8 sm:p-4"
          aria-label={isAudioPlaying ? "Mute audio" : "Play audio"}
        >
          {isAudioPlaying ? (
            <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </button>
      </div>
    </div>
  );
}
