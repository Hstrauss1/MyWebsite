import Link from "next/link";
import ThemeToggle from "../../../components/ThemeToggle";
import Background from "@/components/background";

export default function SampleProject() {
  return (
    <Background>
      <div className="min-h-screen">
        <ThemeToggle />
        <div className="project-detail-container">
          <Link href="/projects" className="back-button">
            ←
          </Link>

          <div style={{ textAlign: "center" }}>
            <h1 className="project-detail-title">This Is A Title</h1>

            <div
              style={{
                width: "474px",
                height: "346px",
                border: "3px solid var(--border-color)",
                borderRadius: "10px",
                margin: "0 auto 32px",
                backgroundColor: "var(--bg-secondary)",
              }}
            ></div>

            <div className="project-detail-description">
              This is a description of nonsense. This is a description of
              nonsense. This is a description of nonsense. This is a description
              of nonsense. This is a description of nonsense. This is a
              description of nonsense. This is a description of nonsense. This
              is a description of nonsense. This is a description of nonsense.
              This is a description of nonsense. This is a description of
              nonsense. This is a description of nonsense. This is a description
              of nonsense. This is a description of nonsense. This is a
              description of nonsense. This is a description of nonsense. This
              is a description of nonsense. This is a description of nonsense.
              This is a description of nonsense. This is a description of
              nonsense.
            </div>

            <a href="#" className="project-link-button">
              Project Link
            </a>
          </div>
        </div>
      </div>
    </Background>
  );
}
