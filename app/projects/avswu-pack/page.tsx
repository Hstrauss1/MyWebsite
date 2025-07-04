import Link from "next/link";
import ThemeToggle from "../../../components/ThemeToggle";

export default function AVSHUPackProject() {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <div className="project-detail-container">
        <Link href="/projects" className="back-button">
          ←
        </Link>

        <div style={{ textAlign: "center" }}>
          <h1 className="project-detail-title">
            Autonomous Vehicle Security through Blockchain
          </h1>

          <img
            src="./projects/av_green_s.png"
            alt="AVSWU-Pack Project"
            className="project-detail-image"
            style={{ width: "1112px", height: "346px", objectFit: "contain" }}
          />

          <div className="project-detail-description">
            This project delivers a modular simulation toolkit that integrates
            OMNeT++ for network modeling, Veins for vehicular communication, and
            SUMO for realistic traffic generation with a Substrate/Polkadot
            blockchain layer for secure data validation. A gRPC client–server
            architecture manages communication between simulation nodes and the
            blockchain network, while OpenSSL handles cryptographic operations
            such as signature generation and verification. The framework
            includes automated shell scripts to set up a standardized Ubuntu
            22.04 environment. Researchers can easily configure consensus
            parameters, define custom network topologies, and gather metrics on
            latency, throughput and fault tolerance. This project enables rapid
            prototyping of secure autonomous vehicle scenarios in a fully
            transparent and extendable platform.
            <br />
            <br />
            <span style={{ textDecoration: "underline" }}>
              Designed with PhD Gabriel Solomon.
            </span>
          </div>

          <a
            href="https://github.com/Hstrauss1/avswu-pack"
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
