import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "AVSHU-Pack",
    description:
      "A block-chain integrated autonomous vehicle simulation platform.",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDMwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjZjBmOWZmIi8+CjxwYXRoIGQ9Ik0xMjAgODBMMTYwIDEwMEgxNDBWMTIwSDEwMFYxMDBIODBMMTIwIDgwWiIgZmlsbD0iIzRhZDUwMCIvPgo8L3N2Zz4K",
  },
  {
    title: "8X8",
    description: "An 8x8 pixel shape classifier built at the transistor level.",
  },
  {
    title: "8X8",
    description: "An 8x8 pixel shape classifier built at the transistor level.",
  },
  {
    title: "8X8",
    description: "An 8x8 pixel shape classifier built at the transistor level.",
  },
  {
    title: "8X8",
    description: "An 8x8 pixel shape classifier built at the transistor level.",
  },
  {
    title: "8X8",
    description: "An 8x8 pixel shape classifier built at the transistor level.",
  },
  {
    title: "8X8",
    description: "An 8x8 pixel shape classifier built at the transistor level.",
  },
  {
    title: "8X8",
    description: "An 8x8 pixel shape classifier built at the transistor level.",
  },
  {
    title: "8X8",
    description: "An 8x8 pixel shape classifier built at the transistor level.",
  },
];

export default function Projects() {
  return (
    <section className="section">
      <h2 className="section-title">My Projects</h2>
      <div className="grid grid-3">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
            image={project.image}
            link="/projects/sample"
          />
        ))}
      </div>
    </section>
  );
}
