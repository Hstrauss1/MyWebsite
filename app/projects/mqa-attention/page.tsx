import Link from "next/link";
import ThemeToggle from "../../../components/ThemeToggle";

export default function MQAAttentionProject() {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <div className="project-detail-container">
        <Link href="/projects" className="back-button">
          ←
        </Link>

        <div style={{ textAlign: "center" }}>
          <h1 className="project-detail-title">
            Multi-Query Attention Accelerator Research
          </h1>

          <img
            src="/projects/mqa.svg"
            alt="Multi-Query Attention Accelerator Research"
            className="project-detail-image"
          />

          <div className="project-detail-description">
            This project explores accelerator designs for multi-query attention
            inference with a focus on reducing KV-cache traffic, improving
            token streaming efficiency, and understanding the performance
            tradeoffs inside modern attention kernels.
            <br />
            <br />
            I designed KV-stationary systolic dataflows for MQA, modeled
            FlashAttention-style online softmax with running max and
            normalization state, and studied causal masking plus value
            accumulation behavior at the dataflow level.
            <br />
            <br />
            The work also evaluates INT8, FP8, and mixed-precision tradeoffs
            across query-key scoring, KV-cache storage, and value accumulation,
            then compares GPU-style execution, vector-register processing, and
            systolic QK engines with cycle-level performance models.
            <br />
            <br />
            Built in C++ and Python as an architecture research workflow for
            reasoning about bandwidth limits, KV reuse, softmax normalization,
            and pipeline serialization.
          </div>

          <a
            href="https://github.com/Hstrauss1/MQA_Systolic"
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
