interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  link?: string;
}

export default function ProjectCard({
  title,
  description,
  image,
  link,
}: ProjectCardProps) {
  return (
    <div className="card project-card">
      <div className="project-image-container">
        {image ? (
          <img src={image} alt={title} className="project-image" />
        ) : (
          <div className="project-placeholder">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6" />
              <path d="m21 12-6 0m-6 0-6 0" />
            </svg>
          </div>
        )}
      </div>
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        {link && (
          <a href={link} className="btn btn-primary mt-3 inline-block">
            View More
          </a>
        )}
      </div>
    </div>
  );
}
