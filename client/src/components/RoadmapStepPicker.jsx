import { useEffect, useState } from "react";
import { getRoadmap } from "../api/roadmap.js";
import FormField from "./FormField.jsx";
import { formatEvidenceTargets, getRoadmapStepMap } from "../utils/roadmap.js";

export default function RoadmapStepPicker({
  value = [],
  onChange,
  label = "ASE Roadmap Links",
  hint = "Optional. Link this content to one or more roadmap steps so it counts as roadmap evidence.",
}) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadRoadmap = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRoadmap();

        if (mounted) {
          setRoadmap(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setRoadmap(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadRoadmap();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!roadmap) {
      return;
    }

    const validStepIds = getRoadmapStepMap(roadmap);
    const filteredValue = value.filter((stepId) => validStepIds.has(stepId));

    if (filteredValue.length !== value.length) {
      onChange(filteredValue);
    }
  }, [onChange, roadmap, value]);

  const toggleStep = (stepId) => {
    if (value.includes(stepId)) {
      onChange(value.filter((currentStepId) => currentStepId !== stepId));
      return;
    }

    onChange([...value, stepId]);
  };

  return (
    <FormField label={label} htmlFor="roadmap-step-picker" hint={hint}>
      <div id="roadmap-step-picker" className="roadmap-picker">
        {loading ? <p className="status">Loading roadmap steps...</p> : null}
        {error ? <p className="status status--error">{error}</p> : null}

        {roadmap ? (
          <div className="roadmap-picker__groups">
            {roadmap.phases.map((phase) => (
              <section key={phase.id} className="roadmap-picker__phase">
                <div className="roadmap-picker__phase-header">
                  <p className="card__eyebrow">{phase.title}</p>
                  <p className="roadmap-picker__phase-copy">{phase.description}</p>
                </div>

                <div className="roadmap-picker__domain-list">
                  {phase.domains.map((domain) => (
                    <div key={domain.id} className="roadmap-picker__domain">
                      <h3 className="roadmap-picker__domain-title">{domain.title}</h3>
                      <div className="roadmap-picker__step-list">
                        {domain.steps.map((step) => (
                          <label key={step.id} className="roadmap-picker__step">
                            <input
                              type="checkbox"
                              checked={value.includes(step.id)}
                              onChange={() => toggleStep(step.id)}
                            />
                            <div className="roadmap-picker__step-copy">
                              <span className="roadmap-picker__step-title">
                                {step.title}
                              </span>
                              <span className="roadmap-picker__step-meta">
                                Target: {formatEvidenceTargets(step.evidenceTargets)}
                              </span>
                              <span className="roadmap-picker__step-description">
                                {step.objective}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </FormField>
  );
}
