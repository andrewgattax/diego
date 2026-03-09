import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-muted/40">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">NovaTech Solutions</h3>
            <p className="text-sm text-muted-foreground">
              Innovating Tomorrow, Today
            </p>
            <p className="text-sm text-muted-foreground">
              Building the future of enterprise software and cloud infrastructure.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm text-muted-foreground"
                  onClick={(e) => e.preventDefault()}
                >
                  About Us
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm text-muted-foreground"
                  onClick={(e) => e.preventDefault()}
                >
                  Careers
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm text-muted-foreground"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm text-muted-foreground"
                  onClick={(e) => e.preventDefault()}
                >
                  Terms of Service
                </Button>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Connect With Us</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>careers@novatech.com</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.preventDefault()}
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.preventDefault()}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.preventDefault()}
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} NovaTech Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
