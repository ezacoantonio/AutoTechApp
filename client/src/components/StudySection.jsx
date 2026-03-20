export default function StudySection({ title, content }) {
  return (
    <section className="study-section">
      <h2 className="study-section__title">{title}</h2>
      <p className="study-section__content">{content}</p>
    </section>
  );
}

