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
                A Computer Engineer with a passion for understanding the{" "}
                <em>core</em>.
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
              Im a Graduate Computer Engineering student with a passion for
              low-level systems design, embedded programming, security, and
              statistics. I thrive on solving complex technical challenges and
              contributing to innovative, performance-driven projects. Im in
              love with embracing challenging problems.
            </div>
          </div>

          {/* Projects Section */}
          <div className="section">
            <h2 className="section-title">MY PROJECTS</h2>
            <div className="projects-scroll">
              {/* AVSWU-Pack Project */}
              <Link href="/projects/avswu-pack" className="project-card">
                <div
                  style={{
                    width: "100%",
                    height: "148px",
                    backgroundColor: "#D5D7D4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/projects/av_green_s.png"
                    alt="AVSWU-Pack Project"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
                <div className="project-bottom">
                  <div className="project-title">AVSWU-Pack</div>
                  <div className="project-description">
                    A block-chain integrated autonomous vehicle simulation
                    platform.
                  </div>
                </div>
              </Link>

              {/* 8X8 Project */}
              <Link href="/projects/8x8" className="project-card">
                <div
                  style={{
                    width: "100%", // or set fixed width/height if needed
                    height: "200px", // or whatever height you want the image section to be
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/projects/shape_classifier.png"
                    alt="Classifier"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                <div className="project-bottom">
                  <div className="project-title-lato">8X8</div>
                  <div className="project-description-small">
                    An 8x8 pixel shape classifier built at the transistor level.
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
            <h2 className="section-title">LANGUAGES</h2>
            <div className="languages-content">
              64x/32x Assembly, C++/C, Python, Verilog, TCL, CMake, Ink!, Rust,
              JavaScript
            </div>
          </div>

          {/* Coursework Section */}
          <div className="section">
            <h2 className="section-title">RELEVANT COURSEWORK</h2>
            <div className="coursework-content">
              Computer Architecture, Compilers, Digital IC Design, Artificial
              Intelligence, Data Science and Machine Learning, Computer
              Graphics, Computer Networks, Embedded Systems, Circuits, Physics,
              Probability and Statistics, Data-Structures and Algos.
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <PortfolioWidget></PortfolioWidget>
      </div>
    </div>
  );
}
