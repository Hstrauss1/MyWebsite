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
          <h1 className="project-detail-title">Author Attribution</h1>

          <img
            src="/projects/author.png"
            alt="8X8 Project"
            className="project-detail-image"
          />

          <div className="project-detail-description">
            This project runs traditional ML analysis to identify the author of
            an email from the LARGE ENRON CORPUS! I built a text classification
            pipeline to categorize emails based on their content. It processes
            the raw text using TF-IDF vectorization and trains a linear support
            vector classifier (LinearSVC) to learn patterns within the data. The
            workflow includes data loading, feature extraction, model training,
            performance evaluation, and parameter tuning. For further details on
            the motivation, dataset, and analysis, give a look at the
            accompanying paper.
          </div>

          <a
            href="https://github.com/Hstrauss1/EnronAuthorAttribution"
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
