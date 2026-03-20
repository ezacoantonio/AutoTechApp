import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  listCategories,
} from "../api/categories.js";
import CategoryCard from "../components/CategoryCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import FormField from "../components/FormField.jsx";

const initialForm = {
  name: "",
  description: "",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setStatus("");
      await createCategory(form);
      setForm(initialForm);
      setStatus("Category created.");
      await loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Move "${category.name}" and its active topics to recently deleted?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category._id);
      setError("");
      const result = await deleteCategory(category._id);
      setStatus(
        `${category.name} moved to recently deleted. ${result.movedTopicCount} topics were moved with it.`
      );
      await loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Categories</p>
          <h1>Organize the systems you study.</h1>
          <p className="section-heading__text">
            Categories are now managed records, which means they can be deleted
            safely and restored later along with their linked topics.
          </p>
        </div>
      </section>

      <section className="form-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">New Category</p>
            <h2>Add a category</h2>
          </div>
        </div>

        <form className="stack-md" onSubmit={handleCreate}>
          {error ? <p className="status status--error">{error}</p> : null}
          {status ? <p className="status">{status}</p> : null}

          <div className="grid grid--two">
            <FormField label="Category Name" htmlFor="categoryName" required>
              <input
                id="categoryName"
                className="input"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Example: HVAC Systems"
                required
              />
            </FormField>

            <FormField label="Description" htmlFor="categoryDescription">
              <input
                id="categoryDescription"
                className="input"
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Optional short explanation"
              />
            </FormField>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="button button--primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel stack-md">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Active Categories</p>
            <h2>Manage your current study structure.</h2>
          </div>
        </div>

        {loading ? <p className="status">Loading categories...</p> : null}

        {!loading && categories.length > 0 ? (
          <div className="grid grid--two">
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                onDelete={handleDelete}
                deleting={deletingId === category._id}
              />
            ))}
          </div>
        ) : null}

        {!loading && categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create your first category to start organizing topics and notes by system."
          />
        ) : null}
      </section>
    </div>
  );
}

