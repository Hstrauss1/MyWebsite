import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "../../../components/ThemeToggle";

export default function pipelineCPU() {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <div className="project-detail-container">
        <Link href="/projects" className="back-button" aria-label="Back to projects">
          ←
        </Link>

        <div style={{ textAlign: "center" }}>
          <h1 className="project-detail-title">This Website!</h1>

          <Image
            src="/projects/website.png"
            alt="Hudson Strauss portfolio website"
            width={604}
            height={432}
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
            rel="noopener noreferrer"
          >
            Project Link
          </a>
        </div>
      </div>
    </div>
  );
}
