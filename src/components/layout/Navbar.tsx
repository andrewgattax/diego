import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import cabajo from "@/assets/cabajo.jpeg";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-64">
      <div className="flex h-16 items-center justify-between">
        {/* Logo and Company Name */}
        <div className="flex items-center gap-3">
          <img
            src={cabajo}
            alt="NovaTech Solutions Logo"
            className="h-10 w-10 rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-white leading-tight">NovaTech Solutions</span>
            <span className="text-xs text-muted-foreground">Innovating Tomorrow, Today</span>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            toggleTheme();
          }}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="h-9 w-9"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </nav>
  );
}
