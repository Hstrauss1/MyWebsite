import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";
import PortfolioWidget from "@/components/port";
import { Analytics } from "@vercel/analytics/next";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-transparent overflow-visible">
      <ThemeToggle />
      <Analytics />
      <div className="py-12">
        {/* Header Section */}
        <div className="main-content">
          <div className="header-section">
            <div className="profile-photo-container">
              <img
                src="./images/IMG_5431.jpg"
                alt="Hudson Strauss"
                className="profile-photo"
              />
            </div>
            <div className="header-info">
              <h1 className="main-title">Hudson Strauss</h1>
              <p className="subtitle">
                A GPU performance and computer architecture engineer who likes
                understanding the <em>core</em>.
              </p>
              <div className="social-links">
                <a
                  href="https://www.linkedin.com/in/hudsonstrauss/"
                  className="social-link"
                  aria-label="LinkedIn"
                  target="_blank"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 9H2V21H6V9Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a
                  href="https://github.com/Hstrauss1"
                  className="social-link"
                  aria-label="GitHub"
                  target="_blank"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 18.9999C4 20.4999 4 16.4999 2 15.9999M16 21.9999V18.1299C16.0375 17.6531 15.9731 17.1737 15.811 16.7237C15.6489 16.2737 15.3929 15.8634 15.06 15.5199C18.2 15.1699 21.5 13.9799 21.5 8.51994C21.4997 7.12376 20.9627 5.78114 20 4.76994C20.4559 3.54844 20.4236 2.19829 19.91 0.999938C19.91 0.999938 18.73 0.649938 16 2.47994C13.708 1.85876 11.292 1.85876 9 2.47994C6.27 0.649938 5.09 0.999938 5.09 0.999938C4.57638 2.19829 4.54414 3.54844 5 4.76994C4.03013 5.78864 3.49252 7.1434 3.5 8.54994C3.5 13.9699 6.8 15.1599 9.94 15.5499C9.611 15.8899 9.35726 16.2953 9.19531 16.7399C9.03335 17.1844 8.96681 17.658 9 18.1299V21.9999"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div className="main-body">
          {/* About Section */}
          <div className="section">
            <h2 className="section-title">ABOUT</h2>
            <div className="about-content">
              Im a graduate Computer Engineering student focused on GPU
              performance, AI acceleration, and computer architecture. My work
              lives at the boundary between systems and hardware: attention
              dataflows, pipelined processors, simulation infrastructure, and
              the tooling needed to explain where performance actually goes. I
              like building things close to the machine and then reasoning
              carefully about their bottlenecks.
            </div>
          </div>

          {/* Projects Section */}
          <div className="section">
            <h2 className="section-title">MY PROJECTS</h2>
            <div className="projects-scroll">
              {/* MQA Accelerator Research */}
              <Link href="/projects/mqa-attention" className="project-card">
                <div
                  style={{
                    width: "100%",
                    height: "148px",
                    backgroundColor: "#0E1A2B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/projects/mqa.svg"
                    alt="MQA Accelerator Research"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
                <div className="project-bottom">
                  <div className="project-title">MQA Accelerator Research</div>
                  <div className="project-description">
                    KV-stationary attention dataflows, online softmax, and
                    mixed-precision accelerator modeling.
                  </div>
                </div>
              </Link>

              {/* Pipelined CPU Project */}
              <Link href="/projects/pipeline" className="project-card">
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/projects/pipeline.png"
                    alt="Pipelined CPU"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                <div className="project-bottom">
                  <div className="project-title-lato">Pipelined CPU</div>
                  <div className="project-description-small">
                    A custom 32-bit 5-stage Verilog CPU with hazards,
                    forwarding, and cycle-accurate verification.
                  </div>
                </div>
              </Link>

              {/* View More */}
              <Link href="/projects" className="view-more-card">
                <div className="view-more-text">View More</div>
              </Link>
            </div>
          </div>

          {/* Languages Section */}
          <div className="section">
            <h2 className="section-title">LANGUAGES & TOOLS</h2>
            <div className="languages-content">
              Python, Rust, C++, C, Java, x86-64 Assembly, RISC-V, Verilog —
              PyTorch, OpenCV, Scikit-learn, NumPy, Pandas, Stable Diffusion —
              Vivado, Nsight, gdb, CMake, Git, Docker, Linux, OMNeT++, Qiskit,
              Synopsys Custom Compiler, TCL
            </div>
          </div>

          {/* Coursework Section */}
          <div className="section">
            <h2 className="section-title">RELEVANT COURSEWORK</h2>
            <div className="coursework-content">
              High Performance Computer Architecture, Advanced Computer
              Architecture, Advanced OS, Advanced Algorithms, Machine Learning,
              AI Image Compression, IC/ASIC Design, Compilers, Distributed
              Systems, Computer Networks, Embedded Systems, Data Structures &
              Algorithms, Probability and Statistics.
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        {/*<PortfolioWidget />*/}
      </div>
    </div>
  );
}
