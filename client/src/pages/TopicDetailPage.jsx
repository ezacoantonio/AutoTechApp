import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteTopic, getTopic } from "../api/topics.js";
import StudySection from "../components/StudySection.jsx";
import { formatDate } from "../utils/date.js";

export default function TopicDetailPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

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

  if (loading) {
    return <p className="status">Loading topic...</p>;
  }

  if (error) {
    return <p className="status status--error">{error}</p>;
  }

  if (!topic) {
    return <p className="status">Topic not found.</p>;
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Move "${topic.title}" to recently deleted?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      await deleteTopic(topic._id);
      navigate("/recently-deleted");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="stack-lg">
      <section className="topic-hero">
        <Link to="/topics" className="inline-link">
          Back to topics
        </Link>
        <p className="topic-hero__eyebrow">{topic.category}</p>
        <h1>{topic.title}</h1>
        <p className="topic-hero__meta">
          Updated {formatDate(topic.updatedAt)}
        </p>
        <div className="hero__actions">
          <Link to={`/topics/${topic._id}/edit`} className="button button--ghost">
            Edit Topic
          </Link>
          <button
            type="button"
            className="button button--danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Moving..." : "Move To Recently Deleted"}
          </button>
        </div>
      </section>

      <section className="study-layout">
        <StudySection title="What It Is" content={topic.whatItIs} />
        <StudySection title="Common Failures" content={topic.commonFailures} />
        <StudySection title="Symptoms" content={topic.symptoms} />
        <StudySection title="How To Diagnose It" content={topic.diagnosis} />
        <StudySection
          title="Recommended Fix"
          content={topic.recommendedFix}
        />
      </section>
    </div>
  );
}
