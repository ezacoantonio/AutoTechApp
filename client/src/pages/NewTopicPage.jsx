import { useNavigate } from "react-router-dom";
import { createTopic } from "../api/topics.js";
import TopicEditor from "../components/TopicEditor.jsx";

export default function NewTopicPage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const topic = await createTopic(payload);
    navigate(`/topics/${topic._id}`);
  };

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <div>
          <p className="section-heading__eyebrow">New Study Topic</p>
          <h1>Create a structured topic.</h1>
          <p className="section-heading__text">
            Keep each topic focused on what it is, how it fails, how it shows
            up, and how you would diagnose and fix it.
          </p>
        </div>
      </section>

      <TopicEditor
        onSubmit={handleSubmit}
        submitLabel="Save Topic"
        submittingLabel="Saving..."
      />
    </div>
  );
}
