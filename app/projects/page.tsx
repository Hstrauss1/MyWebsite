import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "../../components/ThemeToggle";

export default function ProjectsPage() {
  const projects = [
    {
      title: "MQA Accelerator Research",
      description:
        "Architecture research on KV-stationary attention dataflows, online softmax, and mixed-precision tradeoffs.",
      image: "/projects/mqa.svg",
      link: "/projects/mqa-attention",
      isWide: true,
    },
    {
      title: "Quantum GPU Profiling",
      description:
        "Benchmarking and profiling quantum simulation backends with Nsight-driven GPU performance analysis.",
      image: "/projects/quantum-gpu.svg",
      link: "/projects/quantum-profiling",
      isWide: true,
    },
    {
      title: "Pipelined ISA CPU",
      description:
        "A 5-stage pipelined CPU in Verilog with forwarding, hazards, and cycle-accurate verification.",
      image: "/projects/pipeline.png",
      link: "/projects/pipeline",
      isWide: true,
    },
    {
      title: "AVSWU-Pack",
      description:
        "A block-chain integrated autonomous vehicle simulation platform.",
      image: "/projects/av_green_s.png",
      link: "/projects/avswu-pack",
      isWide: true,
    },
    {
      title: "8X8",
      description:
        "An 8x8 pixel shape classifier built at the transistor level.",
      image: "/projects/shape_classifier.png",
      link: "/projects/8x8",
      isWide: true,
    },
    {
      title: "Raspberry Pi Homelab",
      description:
        "A self-hosted homelab for Linux administration, Docker services, networking, and automation experiments.",
      image: "/projects/raspi.png",
      link: "/projects/raspi",
      isWide: true,
    },
    {
      title: "OpenEducation",
      description: "AI-powered tutoring platform with adaptive quizzes and local LLM.",
      image: "/projects/open-education.svg",
      link: "/projects/open-education",
      isWide: true,
    },
    {
      title: "NoteX",
      description: "A points-based platform for sharing and discovering class notes with AI semantic search.",
      image: "/projects/notex.svg",
      link: "/projects/notex",
      isWide: true,
    },
    {
      title: "Author Attribution",
      description: "A traditional ML approach to author identification.",
      image: "/projects/author.png",
      link: "/projects/Author",
      isWide: true,
    },
    {
      title: "This Website",
      description: "The repo behind this personal website and project archive.",
      image: "/projects/website.png",
      link: "/projects/website",
      isWide: true,
    },
  ];

  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <div className="py-12">
        <div className="container">
          <Link
            href="/"
            className="back-button"
            aria-label="Back to home"
          >
            ←
          </Link>

          <div className="projects-total">
            <h2 className="section-title">MY PROJECTS</h2>

            <div className="projects-grid">
              {projects.map((project) => (
                <Link
                  key={project.link}
                  href={project.link}
                  className="project-card"
                  style={
                    project.title === "AVSWU-Pack"
                      ? { backgroundColor: "#D5D7D4" }
                      : {}
                  }
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={640}
                      height={360}
                      className={
                        project.isWide ? "project-image-large" : "project-image"
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
  );
}
