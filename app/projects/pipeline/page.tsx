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
          <h1 className="project-detail-title">Pipelined ISA CPU (Verilog)</h1>

          <Image
            src="/projects/pipeline.png"
            alt="Pipelined CPU schematic"
            width={604}
            height={432}
            className="project-detail-image"
          />

          <div className="project-detail-description">
            This 5-stage pipelined CPU was implemented in Verilog HDL based on
            the SCU ISA, with support for 12 instructions including arithmetic,
            memory, and control flow operations. Instructions follow a fixed
            32-bit format, and the pipeline includes IF, ID, EX, MEM, and WB
            stages with hazard-handling logic.
            <br />
            <br />
            The CPU was tested with assembly programs like a MIN function and
            vector addition. Control signals are managed via a centralized unit
            with a truth table, and data/control flow is verified through
            waveform simulation. The pipeline achieves one-instruction-per-cycle
            throughput in ideal cases, with performance analysis estimating a
            base CPI of ~1.5 and max clock frequency of 250 MHz.
          </div>

          <a
            href="https://github.com/Hstrauss1/PipelinedCPU/tree/main"
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
