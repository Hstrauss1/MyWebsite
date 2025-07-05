import Link from "next/link";
import ThemeToggle from "../../components/ThemeToggle";
import TestPage2 from "@/app/test2/page";

export default function SampleProject() {
  return (
    <div className="fullscreen-wrapper">
      {/* UI layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
          padding: "1rem",
          height: "100vh",
          width: "100vw",
        }}
      >
        <ThemeToggle />
        <div className="project-detail-container">
          <Link href="/ " className="back-button">
            ←
          </Link>
        </div>
      </div>

      {/* Fullscreen canvas */}
      <TestPage2 />
    </div>
  );
}
