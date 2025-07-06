import Link from "next/link";
import ThemeToggle from "../../../components/ThemeToggle";
import TestPage from "@/components/obiwan";

export default function SampleProject() {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <div className="project-detail-container">
        <Link href="/projects" className="back-button">
          ←
        </Link>
        <Link href="/sopcart" className="right-corner-button">
          ✨ Click Me
        </Link>
      </div>
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <TestPage />
        </div>
      </div>
    </div>
  );
}
