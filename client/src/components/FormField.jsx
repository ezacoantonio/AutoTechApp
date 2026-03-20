export default function FormField({
  label,
  htmlFor,
  hint,
  required = false,
  children,
}) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor} className="control-label">
        {label} {required ? <span className="required-mark">*</span> : null}
      </label>
      {hint ? <p className="field-hint">{hint}</p> : null}
      {children}
    </div>
  );
}
