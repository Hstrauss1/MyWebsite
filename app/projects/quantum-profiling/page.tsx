import Link from "next/link";
import ThemeToggle from "../../../components/ThemeToggle";

export default function QuantumProfilingProject() {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <div className="project-detail-container">
        <Link href="/projects" className="back-button">
          ←
        </Link>

        <div style={{ textAlign: "center" }}>
          <h1 className="project-detail-title">
            Quantum Circuit Simulation &amp; GPU Profiling
          </h1>

          <img
            src="/projects/quantum-gpu.svg"
            alt="Quantum Circuit Simulation and GPU Profiling"
            className="project-detail-image"
          />

          <div className="project-detail-description">
            This project benchmarks quantum circuit simulation across CPU and
            GPU backends to understand where performance is won or lost as
            circuit size, backend behavior, and hardware configuration change.
            <br />
            <br />
            I built benchmarking workflows with PennyLane and Qiskit, then
            profiled GPU execution using NVIDIA Nsight Systems and Nsight
            Compute to inspect timelines, transfer overhead, kernel launches,
            occupancy, and memory behavior.
            <br />
            <br />
            The project focused on performance modeling as much as raw speed:
            comparing simulation methods, identifying framework overhead,
            measuring low-utilization regimes, and isolating memory-bound
            execution patterns across different workloads.
            <br />
            <br />
            Built with Python plus GPU profiling tooling to study how
            architecture-level bottlenecks shape AI and scientific workloads in
            practice.
          </div>

          <a
            href="https://github.com/Hstrauss1"
            className="project-link-button"
            target="_blank"
          >
            GitHub Profile
          </a>
        </div>
      </div>
    </div>
  );
}
