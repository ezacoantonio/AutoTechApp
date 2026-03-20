import { useId } from "react";

export default function CategoryFilter({ categories = [], value, onChange }) {
  const id = useId();

  return (
    <label className="control-group" htmlFor={id}>
      <span className="control-label">Category</span>
      <select
        id={id}
        className="select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={categories.length === 0}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
    </label>
  );
}
