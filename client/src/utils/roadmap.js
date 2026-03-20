export const ROADMAP_STATUS_LABELS = {
  not_started: "Not started",
  building: "Building",
  ready_to_review: "Ready to review",
};

export function getRoadmapStatusLabel(status) {
  return ROADMAP_STATUS_LABELS[status] || "Not started";
}

export function getRoadmapStatusClassName(status) {
  return `roadmap-status roadmap-status--${String(status || "not_started").replaceAll(
    "_",
    "-"
  )}`;
}

export function getRoadmapStepIdsFromSearchParams(searchParams) {
  return [
    ...new Set(
      searchParams
        .getAll("roadmapStepId")
        .flatMap((value) => value.split(","))
        .map((value) => value.trim())
        .filter(Boolean)
    ),
  ];
}

export function formatEvidenceTargets(targets) {
  const parts = [];

  if (targets.topics > 0) {
    parts.push(`${targets.topics} topic${targets.topics === 1 ? "" : "s"}`);
  }

  if (targets.caseNotes > 0) {
    parts.push(
      `${targets.caseNotes} case note${targets.caseNotes === 1 ? "" : "s"}`
    );
  }

  if (targets.notebooks > 0) {
    parts.push(
      `${targets.notebooks} notebook${targets.notebooks === 1 ? "" : "s"}`
    );
  }

  return parts.length > 0 ? parts.join(" / ") : "No evidence required";
}

export function formatEvidenceCounts(counts) {
  const parts = [];

  if (counts.topics > 0) {
    parts.push(`${counts.topics} topic${counts.topics === 1 ? "" : "s"}`);
  }

  if (counts.caseNotes > 0) {
    parts.push(
      `${counts.caseNotes} case note${counts.caseNotes === 1 ? "" : "s"}`
    );
  }

  if (counts.notebooks > 0) {
    parts.push(
      `${counts.notebooks} notebook${counts.notebooks === 1 ? "" : "s"}`
    );
  }

  return parts.length > 0 ? parts.join(" / ") : "No linked evidence yet";
}

export function getRoadmapStepMap(roadmap) {
  const stepMap = new Map();

  if (!roadmap?.phases) {
    return stepMap;
  }

  roadmap.phases.forEach((phase) => {
    phase.domains.forEach((domain) => {
      domain.steps.forEach((step) => {
        stepMap.set(step.id, {
          ...step,
          phaseTitle: phase.title,
          domainTitle: domain.title,
        });
      });
    });
  });

  return stepMap;
}
