import Link from "next/link";
import ThemeToggle from "../../../components/ThemeToggle";

export default function EightByEightProject() {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <div className="project-detail-container">
        <Link href="/projects" className="back-button">
          ←
        </Link>

        <div style={{ textAlign: "center" }}>
          <h1 className="project-detail-title">
            8×8 Transistor-Level Shape Classifier
          </h1>

          <img
            src="/projects/shape_classifier.png"
            alt="8X8 Project"
            className="project-detail-image"
          />

          <div className="project-detail-description">
            This 8 by 8 transistor level fully custom mixed signal shape
            classifier was implemented using the SAED PDK 90 NMOS and PMOS
            instances nmos_4t and pmos_4t with widths of 0.4 micrometers and 1.2
            micrometers and lengths of 0.1 micrometers to operate at 1.2 volts.
            It computes pixel density as the count of ones on the grid and
            measures contour complexity by exclusive or operations between
            adjacent horizontal and vertical pixels. It counts all one hundred
            twelve neighbor pairs and classifies triangles squares and circles
            based on empirical threshold ranges for pixel count and edge count
            for each shape.
          </div>

          <a
            href="https://github.com/Hstrauss1/8by8-Shape-Transistor-Classifier"
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
