import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTopic, updateTopic } from "../api/topics.js";
import TopicEditor from "../components/TopicEditor.jsx";

export default function EditTopicPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadTopic = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getTopic(topicId);

        if (mounted) {
          setTopic(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTopic();

    return () => {
      mounted = false;
    };
  }, [topicId]);

  const handleSubmit = async (payload) => {
    const updatedTopic = await updateTopic(topicId, payload);
    navigate(`/topics/${updatedTopic._id}`);
  };

  if (loading) {
    return <p className="status">Loading topic...</p>;
  }

  if (error) {
    return <p className="status status--error">{error}</p>;
  }

  if (!topic) {
    return <p className="status">Topic not found.</p>;
  }

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Edit Study Topic</p>
          <h1>Update this study topic.</h1>
          <p className="section-heading__text">
            Refine the explanation, failures, symptoms, diagnosis path, or fix
            so your study library stays accurate.
          </p>
        </div>
      </section>

      <TopicEditor
        initialTopic={topic}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/topics/${topicId}`)}
        submitLabel="Save Changes"
        submittingLabel="Saving Changes..."
      />
    </div>
  );
}
