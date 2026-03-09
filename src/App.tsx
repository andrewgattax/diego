import { useEffect, useState, useRef } from "react";
import { themeService } from "@/services/themeService";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobApplicationForm from "@/components/form/JobApplicationForm";
import Diego from "@/components/diego/Diego.tsx";
import type { DiegoRef } from "@/types/diego";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const diegoRef = useRef<DiegoRef>(null);

  useEffect(() => {
    setTheme(themeService.init());
  }, []);

  const toggleTheme = () => {
    setTheme(themeService.toggle());
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Diego ref={diegoRef} />
      <div className="min-h-screen bg-background">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="px-64 py-8">
          <JobApplicationForm onDiegoFlash={() => diegoRef.current?.flash()} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
