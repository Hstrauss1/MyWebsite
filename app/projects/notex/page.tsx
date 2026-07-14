import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "../../../components/ThemeToggle";

export default function NoteXProject() {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <div className="project-detail-container">
        <Link href="/projects" className="back-button" aria-label="Back to projects">
          ←
        </Link>

        <div style={{ textAlign: "center" }}>
          <h1 className="project-detail-title">NoteX</h1>

          <Image
            src="/projects/notex.svg"
            alt="NoteX logo"
            width={400}
            height={225}
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              display: "block",
              margin: "0 auto 32px",
              borderRadius: "10px",
              border: "3px solid var(--border-color)",
            }}
          />

          <div className="project-detail-description">
            A student-focused platform for uploading, sharing, and discovering
            class notes. NoteX runs on a points-based economy — users earn
            credits when peers find their materials valuable, and spend points
            to access notes from classmates.
            <br />
            <br />
            Notes are organized by course and stored as PDFs. An AI-powered
            semantic search layer built with the Vercel AI SDK and Google
            Gemini 2.0 Flash lets students discover relevant material across
            courses. Users can also leave reviews on shared notes.
            <br />
            <br />
            Built with Next.js 15, React 19, Tailwind CSS, and shadcn/ui on
            the frontend, with a Python/Flask backend and Supabase for
            authentication (Google OAuth), PostgreSQL storage, and file
            buckets.
          </div>

          <a
            href="https://github.com/Hstrauss1/NoteX"
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
