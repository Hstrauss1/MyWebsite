import Link from "next/link";
import ThemeToggle from "../../../components/ThemeToggle";

export default function pipelineCPU() {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <div className="project-detail-container">
        <Link href="/projects" className="back-button">
          ←
        </Link>

        <div style={{ textAlign: "center" }}>
          <h1 className="project-detail-title">This Website!</h1>

          <img
            src="/projects/website.png"
            alt="websiteProject"
            className="project-detail-image"
          />

          <div className="project-detail-description">
            <br />
            <br />
            This is just the repo of this very website!
          </div>

          <a
            href="https://github.com/Hstrauss1/MyWebsite"
            className="project-link-button"
            target="_blank"
          >
            Project Link
          </a>
        </div>
      </div>
    </div>
  );
}
