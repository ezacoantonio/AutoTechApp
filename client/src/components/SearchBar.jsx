import { useId } from "react";

export default function SearchBar({
  label = "Search",
  placeholder,
  value,
  onChange,
}) {
  const id = useId();

  return (
    <label className="control-group" htmlFor={id}>
      <span className="control-label">{label}</span>
      <input
        id={id}
        type="search"
        className="input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

