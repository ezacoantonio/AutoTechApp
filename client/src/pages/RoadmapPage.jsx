import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRoadmap } from "../api/roadmap.js";
import {
  formatEvidenceCounts,
  formatEvidenceTargets,
  getRoadmapStatusClassName,
  getRoadmapStatusLabel,
} from "../utils/roadmap.js";

function SummaryCard({ label, value, hint }) {
  return (
    <article className="roadmap-summary-card">
      <p className="card__eyebrow">{label}</p>
      <div className="roadmap-summary-card__value">{value}</div>
      <p className="roadmap-summary-card__hint">{hint}</p>
    </article>
  );
}

export default function RoadmapPage() {
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

  if (loading) {
    return <p className="status">Loading ASE roadmap...</p>;
  }

  if (error) {
    return <p className="status status--error">{error}</p>;
  }

  if (!roadmap) {
    return <p className="status">Roadmap not found.</p>;
  }

  return (
    <div className="stack-lg roadmap-shell">
      <section className="topic-hero roadmap-hero">
        <p className="topic-hero__eyebrow">ASE-Style Learning Path</p>
        <h1>{roadmap.title}</h1>
        <p className="section-heading__text">{roadmap.subtitle}</p>
        <p className="topic-hero__meta">{roadmap.note}</p>
      </section>

      <section className="panel">
        <div className="section-heading section-heading--hero">
          <div>
            <p className="section-heading__eyebrow">Roadmap Summary</p>
            <h2>Track readiness by building real diagnostic evidence.</h2>
            <p className="section-heading__text">
              Each step becomes stronger as you link structured topics, real case
              notes, and notebook references to the exact area you are training.
            </p>
          </div>
          {roadmap.summary.nextStep ? (
            <div className="tracker-badge">
              <span className="tracker-badge__label">Next recommended step</span>
              <span className="tracker-badge__value">
                {roadmap.summary.nextStep.title}
              </span>
              <span className="tracker-metric__subtitle">
                {roadmap.summary.nextStep.phaseTitle} /{" "}
                {roadmap.summary.nextStep.domainTitle}
              </span>
            </div>
          ) : null}
        </div>

        <div className="roadmap-summary-grid">
          <SummaryCard
            label="Overall Progress"
            value={`${roadmap.summary.progressPercent}%`}
            hint={`${roadmap.summary.readySteps} ready / ${roadmap.summary.totalSteps} total steps`}
          />
          <SummaryCard
            label="Building"
            value={roadmap.summary.buildingSteps}
            hint="Steps with some evidence but more work still needed"
          />
          <SummaryCard
            label="Evidence"
            value={roadmap.summary.evidenceCounts.topics}
            hint={`${roadmap.summary.evidenceCounts.caseNotes} case notes / ${roadmap.summary.evidenceCounts.notebooks} notebooks`}
          />
          <SummaryCard
            label="Not Started"
            value={roadmap.summary.notStartedSteps}
            hint="Steps still waiting for their first linked evidence"
          />
        </div>
      </section>

      <div className="stack-lg">
        {roadmap.phases.map((phase) => (
          <section key={phase.id} className="panel roadmap-phase">
            <div className="roadmap-phase__header">
              <div>
                <p className="section-heading__eyebrow">{phase.title}</p>
                <h2>{phase.description}</h2>
              </div>
              <div className="meta-row">
                <span className="meta-chip">
                  {phase.summary.progressPercent}% complete
                </span>
                <span className="meta-chip meta-chip--muted">
                  {phase.summary.readySteps} ready / {phase.summary.totalSteps} steps
                </span>
              </div>
            </div>

            <div className="stack-md">
              {phase.domains.map((domain) => (
                <article key={domain.id} className="roadmap-domain">
                  <div className="roadmap-domain__header">
                    <div>
                      <p className="card__eyebrow">Domain</p>
                      <h3 className="card__title">{domain.title}</h3>
                      <p className="card__body">{domain.description}</p>
                    </div>
                    <span className="meta-chip meta-chip--muted">
                      {domain.summary.progressPercent}% complete
                    </span>
                  </div>

                  <div className="stack-md">
                    {domain.steps.map((step) => (
                      <article key={step.id} className="roadmap-step">
                        <div className="roadmap-step__top">
                          <div className="roadmap-step__copy">
                            <div className="meta-row">
                              <span
                                className={getRoadmapStatusClassName(step.status)}
                              >
                                {getRoadmapStatusLabel(step.status)}
                              </span>
                              {step.categoryHints?.map((hint) => (
                                <span
                                  key={`${step.id}-${hint}`}
                                  className="meta-chip meta-chip--muted"
                                >
                                  {hint}
                                </span>
                              ))}
                            </div>
                            <h4 className="roadmap-step__title">{step.title}</h4>
                            <p className="roadmap-step__objective">
                              {step.objective}
                            </p>
                            <p className="roadmap-step__focus">
                              Exam-style focus: {step.examFocus}
                            </p>
                            <p className="roadmap-step__focus">
                              Suggested action: {step.suggestedAction}
                            </p>
                          </div>
                          <div className="roadmap-step__progress">
                            <span className="roadmap-step__progress-value">
                              {step.progressPercent}%
                            </span>
                            <span className="roadmap-step__progress-label">
                              readiness
                            </span>
                          </div>
                        </div>

                        <div className="roadmap-meter">
                          <span
                            className="roadmap-meter__fill"
                            style={{ "--roadmap-progress": `${step.progressPercent}%` }}
                          />
                        </div>

                        <div className="roadmap-step__meta">
                          <div className="roadmap-step__meta-block">
                            <span className="roadmap-step__meta-label">Targets</span>
                            <span className="roadmap-step__meta-value">
                              {formatEvidenceTargets(step.evidenceTargets)}
                            </span>
                          </div>
                          <div className="roadmap-step__meta-block">
                            <span className="roadmap-step__meta-label">
                              Linked evidence
                            </span>
                            <span className="roadmap-step__meta-value">
                              {formatEvidenceCounts(step.evidenceCounts)}
                            </span>
                          </div>
                        </div>

                        <div className="roadmap-step__actions">
                          <Link
                            to={`/topics/new?roadmapStepId=${encodeURIComponent(step.id)}`}
                            className="button button--ghost"
                          >
                            Add Topic
                          </Link>
                          <Link
                            to={`/case-notes/new?roadmapStepId=${encodeURIComponent(step.id)}`}
                            className="button button--ghost"
                          >
                            Add Case Note
                          </Link>
                          <Link
                            to={`/notebooks/new?roadmapStepId=${encodeURIComponent(step.id)}`}
                            className="button button--primary"
                          >
                            Add Notebook
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
