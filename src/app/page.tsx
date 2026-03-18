"use client"

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobApplicationForm from "@/components/form/JobApplicationForm";
import { DiegoProvider } from "@/contexts/DiegoContext";
import Clock from "@/components/clock/Clock";

import { useDiego } from "@/contexts/DiegoContext";

function AppContent() {
  const { showClock } = useDiego();

  if (showClock) {
    return <Clock />;
  }

  return (
      <div className="dark">
        <div className="min-h-screen bg-background">
          <Navbar theme="dark" toggleTheme={() => { }} />
          <main className="container mx-auto px-4 py-8 md:px-8 lg:px-16 xl:px-32 max-w-8xl">
            <JobApplicationForm />
          </main>
          <Footer />
        </div>
      </div>
  );
}

export default function Page() {
  return (
      <DiegoProvider>
        <AppContent />
      </DiegoProvider>
  );
}
