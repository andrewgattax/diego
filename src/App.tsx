import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobApplicationForm from "@/components/form/JobApplicationForm";
import { DiegoProvider } from "@/contexts/DiegoContext";
import Clock from "@/components/clock/Clock.tsx";

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
        <main className="px-64 py-8">
          <JobApplicationForm />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DiegoProvider>
      <AppContent />
    </DiegoProvider>
  );
}
