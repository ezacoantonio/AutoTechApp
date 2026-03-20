import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCategories } from "../api/categories.js";
import EmptyState from "./EmptyState.jsx";
import FormField from "./FormField.jsx";
import RoadmapStepPicker from "./RoadmapStepPicker.jsx";

const createTopicForm = (
  topic = null,
  fallbackCategoryId = "",
  fallbackRoadmapStepIds = []
) => ({
  title: topic?.title || "",
  categoryId: topic?.categoryId || fallbackCategoryId,
  roadmapStepIds: Array.isArray(topic?.roadmapStepIds)
    ? [...topic.roadmapStepIds]
    : [...fallbackRoadmapStepIds],
  whatItIs: topic?.whatItIs || "",
  commonFailures: topic?.commonFailures || "",
  symptoms: topic?.symptoms || "",
  diagnosis: topic?.diagnosis || "",
  recommendedFix: topic?.recommendedFix || "",
});

export default function TopicEditor({
  initialTopic = null,
  initialRoadmapStepIds = [],
  onSubmit,
  onCancel,
  submitLabel = "Save Topic",
  submittingLabel = "Saving...",
}) {
  const [form, setForm] = useState(() =>
    createTopicForm(initialTopic, "", initialRoadmapStepIds)
  );
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        const data = await listCategories();

        if (!mounted) {
          return;
        }

        setCategories(data);
        setForm((current) =>
          createTopicForm(
            initialTopic,
            current.categoryId || initialTopic?.categoryId || data[0]?._id || "",
            current.roadmapStepIds.length > 0
              ? current.roadmapStepIds
              : initialTopic?.roadmapStepIds || initialRoadmapStepIds
          )
        );
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setCategories([]);
        }
      } finally {
        if (mounted) {
          setLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, [initialRoadmapStepIds, initialTopic]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="stack-lg">
      {error && categories.length === 0 ? (
        <p className="status status--error">{error}</p>
      ) : null}

      {!loadingCategories && categories.length === 0 ? (
        <EmptyState
          title="Add a category first"
          description="Topics belong to managed categories. Create at least one category before saving a topic."
          actionLabel="Open Categories"
          actionTo="/categories"
        />
      ) : null}

      {loadingCategories ? <p className="status">Loading categories...</p> : null}

      {categories.length > 0 ? (
        <form className="form-card" onSubmit={handleSubmit}>
          {error ? <p className="status status--error">{error}</p> : null}

          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Linked Category</p>
              <h2>Place this topic in your study structure.</h2>
            </div>
            <div className="toolbar-actions">
              <Link to="/categories" className="button button--ghost">
                Edit Categories
              </Link>
              {onCancel ? (
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </div>

          <FormField label="Topic Title" htmlFor="title" required>
            <input
              id="title"
              className="input"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Example: Oxygen Sensor"
              required
            />
          </FormField>

          <FormField label="Category" htmlFor="category" required>
            <select
              id="category"
              className="select"
              value={form.categoryId}
              onChange={(event) => updateField("categoryId", event.target.value)}
              required
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FormField>

          <RoadmapStepPicker
            value={form.roadmapStepIds}
            onChange={(nextValue) => updateField("roadmapStepIds", nextValue)}
          />

          <FormField
            label="What It Is"
            htmlFor="whatItIs"
            hint="Explain the system or component in plain language."
            required
          >
            <textarea
              id="whatItIs"
              className="textarea"
              value={form.whatItIs}
              onChange={(event) => updateField("whatItIs", event.target.value)}
              rows={4}
              required
            />
          </FormField>

          <FormField
            label="Common Failures"
            htmlFor="commonFailures"
            hint="List the most common ways it fails or gets misdiagnosed."
            required
          >
            <textarea
              id="commonFailures"
              className="textarea"
              value={form.commonFailures}
              onChange={(event) =>
                updateField("commonFailures", event.target.value)
              }
              rows={4}
              required
            />
          </FormField>

          <FormField
            label="Symptoms"
            htmlFor="symptoms"
            hint="Describe what the driver or technician would likely notice."
            required
          >
            <textarea
              id="symptoms"
              className="textarea"
              value={form.symptoms}
              onChange={(event) => updateField("symptoms", event.target.value)}
              rows={4}
              required
            />
          </FormField>

          <FormField
            label="How To Diagnose It"
            htmlFor="diagnosis"
            hint="Focus on diagnostic checks, observations, or test strategy."
            required
          >
            <textarea
              id="diagnosis"
              className="textarea"
              value={form.diagnosis}
              onChange={(event) => updateField("diagnosis", event.target.value)}
              rows={4}
              required
            />
          </FormField>

          <FormField
            label="Recommended Fix"
            htmlFor="recommendedFix"
            hint="Capture the best repair direction once the cause is confirmed."
            required
          >
            <textarea
              id="recommendedFix"
              className="textarea"
              value={form.recommendedFix}
              onChange={(event) =>
                updateField("recommendedFix", event.target.value)
              }
              rows={4}
              required
            />
          </FormField>

          <div className="form-actions">
            <button
              type="submit"
              className="button button--primary"
              disabled={submitting}
            >
              {submitting ? submittingLabel : submitLabel}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
