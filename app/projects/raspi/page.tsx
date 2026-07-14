import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "../../../components/ThemeToggle";

export default function RaspiProject() {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <div className="project-detail-container">
        <Link href="/projects" className="back-button" aria-label="Back to projects">
          ←
        </Link>

        <div style={{ textAlign: "center" }}>
          <h1 className="project-detail-title">Raspberry Pi Homelab</h1>

          <Image
            src="/projects/raspi.png"
            alt="Raspberry Pi homelab"
            width={604}
            height={432}
            className="project-detail-image"
          />

          <div className="project-detail-description">
            A Raspberry Pi 4 running a self-hosted homelab environment. The
            setup serves as a personal server for running lightweight services,
            experimenting with Linux system administration, and learning
            networking concepts hands-on.
            <br />
            <br />
            The Pi runs a headless Raspberry Pi OS configuration managed over
            SSH, with services deployed via Docker. It acts as a local DNS
            resolver, a network-wide ad blocker with Pi-hole, and a platform
            for scripting and automation projects. The setup has been a
            practical ground for exploring real-world systems concepts outside
            of coursework.
          </div>

          <a
            href="https://github.com/Hstrauss1/HudOS"
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
