import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobApplicationForm from "@/components/form/JobApplicationForm";
import { DiegoProvider } from "@/contexts/DiegoContext";
import Clock from "@/components/clock/Clock.tsx";

export default function App() {
  return (
    // <DiegoProvider>
    //   <div className="dark">
    //     <div className="min-h-screen bg-background">
    //       <Navbar theme="dark" toggleTheme={() => {}} />
    //       <main className="px-64 py-8">
    //         <JobApplicationForm />
    //       </main>
    //       <Footer />
    //     </div>
    //   </div>
    // </DiegoProvider>
    <Clock />
  );
}
