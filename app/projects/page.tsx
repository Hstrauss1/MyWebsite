import Link from "next/link";
import ThemeToggle from "../../components/ThemeToggle";
import Background from "@/components/background";

export default function ProjectsPage() {
  const projects = [
    {
      title: "AVSWU-Pack",
      description:
        "A block-chain integrated autonomous vehicle simulation platform.",
      image: "./projects/av_green_s.png",
      link: "/projects/avswu-pack",
      isWide: false,
    },
    {
      title: "8X8",
      description:
        "An 8x8 pixel shape classifier built at the transistor level.",
      image: "./projects/shape_classifier.png",
      link: "/projects/8x8",
      isWide: true,
    },
    // Placeholder projects with technical icons
    ...Array(7)
      .fill(null)
      .map((_, index) => ({
        title: "?",
        description: "to be D",
        image: null,
        link: "/projects/sample",
        isWide: false,
      })),
  ];

  return (
    <Background>
      <div className="min-h-screen">
        <ThemeToggle />
        <div className="py-12">
          <div className="container">
            <Link
              href="/"
              className="back-button"
              style={{ marginLeft: "80px", marginBottom: "50px" }}
            >
              ←
            </Link>

            <div className="projects-total">
              <h2 className="section-title">MY PROJECTS</h2>

              <div className="projects-grid">
                {projects.map((project, index) => (
                  <Link
                    key={index}
                    href={project.link}
                    className="project-card"
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className={
                          project.isWide
                            ? "project-image-large"
                            : "project-image"
                        }
                      />
                    ) : (
                      <div
                        style={{
                          width: "326px",
                          height: "155px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f5f5f5",
                        }}
                      >
                        <svg
                          width="60"
                          height="60"
                          viewBox="0 0 60 60"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <ellipse
                            cx="30"
                            cy="25"
                            rx="20"
                            ry="18"
                            fill="white"
                            stroke="black"
                            strokeLinecap="square"
                            strokeDasharray="1000 2000"
                          />
                          <path
                            d="M22 22C17 12 24 8 27 8C27 8 32 7 35 9C38 10 39.5 15.5 38.5 20C37.5 23.5 33 26 33 26L29 28M29 28V35V38M29 28V29"
                            stroke="black"
                          />
                          <circle cx="29" cy="42" r="2" fill="black" />
                        </svg>
                      </div>
                    )}
                    <div className="project-bottom">
                      <div className="project-title-lato">{project.title}</div>
                      <div className="project-description-small">
                        {project.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}
