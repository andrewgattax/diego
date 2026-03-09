import { useEffect, useState } from "react";
import { themeService } from "@/services/themeService";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobApplicationForm from "@/components/form/JobApplicationForm";
import Diego from "@/components/diego/Diego.tsx";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(themeService.init());
  }, []);

  const toggleTheme = () => {
    setTheme(themeService.toggle());
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Diego/>
      <div className="min-h-screen bg-background">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="px-64 py-8">
          <JobApplicationForm />
        </main>
        <Footer />
      </div>
    </div>
  );
}
