import { roadmapDefinition } from "../data/roadmapDefinition.js";
import Topic from "../models/Topic.js";
import CaseNote from "../models/CaseNote.js";
import Notebook from "../models/Notebook.js";

const STATUS = {
  notStarted: "not_started",
  building: "building",
  readyToReview: "ready_to_review",
};

const createEvidenceCounts = () => ({
  topics: 0,
  caseNotes: 0,
  notebooks: 0,
});

const createSummary = () => ({
  totalSteps: 0,
  notStartedSteps: 0,
  buildingSteps: 0,
  readySteps: 0,
  progressPercent: 0,
  evidenceCounts: createEvidenceCounts(),
  nextStep: null,
});

const addRecordCounts = (records, fieldName, countMap) => {
  records.forEach((record) => {
    const stepIds = Array.isArray(record.roadmapStepIds)
      ? [...new Set(record.roadmapStepIds)]
      : [];

    stepIds.forEach((stepId) => {
      const counts = countMap.get(stepId) || createEvidenceCounts();
      counts[fieldName] += 1;
      countMap.set(stepId, counts);
    });
  });
};

const getStepProgressPercent = (targets, counts) => {
  const totalTarget = Object.values(targets).reduce((sum, value) => sum + value, 0);

  if (totalTarget === 0) {
    return 100;
  }

  const achieved = Object.entries(targets).reduce(
    (sum, [key, value]) => sum + Math.min(counts[key] || 0, value),
    0
  );

  return Math.round((achieved / totalTarget) * 100);
};

const getStepStatus = (targets, counts) => {
  const progressPercent = getStepProgressPercent(targets, counts);
  const totalEvidence = Object.values(counts).reduce((sum, value) => sum + value, 0);

  if (progressPercent >= 100) {
    return STATUS.readyToReview;
  }

  if (totalEvidence > 0) {
    return STATUS.building;
  }

  return STATUS.notStarted;
};

const summarizeSteps = (steps) => {
  const summary = createSummary();

  steps.forEach((step) => {
    summary.totalSteps += 1;
    summary.evidenceCounts.topics += step.evidenceCounts.topics;
    summary.evidenceCounts.caseNotes += step.evidenceCounts.caseNotes;
    summary.evidenceCounts.notebooks += step.evidenceCounts.notebooks;

    if (step.status === STATUS.readyToReview) {
      summary.readySteps += 1;
    } else if (step.status === STATUS.building) {
      summary.buildingSteps += 1;
    } else {
      summary.notStartedSteps += 1;
    }
  });

  summary.progressPercent =
    summary.totalSteps > 0
      ? Math.round(
          steps.reduce((sum, step) => sum + step.progressPercent, 0) /
            summary.totalSteps
        )
      : 0;

  return summary;
};

const findNextStep = (phases) => {
  for (const phase of phases) {
    for (const domain of phase.domains) {
      for (const step of domain.steps) {
        if (step.status !== STATUS.readyToReview) {
          return {
            id: step.id,
            title: step.title,
            status: step.status,
            phaseTitle: phase.title,
            domainTitle: domain.title,
          };
        }
      }
    }
  }

  return null;
};

export const getRoadmap = async (req, res) => {
  const [topics, caseNotes, notebooks] = await Promise.all([
    Topic.find({ isDeleted: false }).select("roadmapStepIds").lean(),
    CaseNote.find({}).select("roadmapStepIds").lean(),
    Notebook.find({}).select("roadmapStepIds").lean(),
  ]);

  const countMap = new Map();

  roadmapDefinition.phases.forEach((phase) => {
    phase.domains.forEach((domain) => {
      domain.steps.forEach((step) => {
        countMap.set(step.id, createEvidenceCounts());
      });
    });
  });

  addRecordCounts(topics, "topics", countMap);
  addRecordCounts(caseNotes, "caseNotes", countMap);
  addRecordCounts(notebooks, "notebooks", countMap);

  const phases = roadmapDefinition.phases.map((phase) => {
    const domains = phase.domains.map((domain) => {
      const steps = domain.steps.map((step) => {
        const evidenceCounts = countMap.get(step.id) || createEvidenceCounts();

        return {
          ...step,
          evidenceCounts,
          progressPercent: getStepProgressPercent(
            step.evidenceTargets,
            evidenceCounts
          ),
          status: getStepStatus(step.evidenceTargets, evidenceCounts),
        };
      });

      return {
        ...domain,
        steps,
        summary: summarizeSteps(steps),
      };
    });

    const phaseSteps = domains.flatMap((domain) => domain.steps);

    return {
      ...phase,
      domains,
      summary: summarizeSteps(phaseSteps),
    };
  });

  const allSteps = phases.flatMap((phase) =>
    phase.domains.flatMap((domain) => domain.steps)
  );
  const summary = summarizeSteps(allSteps);
  summary.nextStep = findNextStep(phases);

  res.json({
    title: roadmapDefinition.title,
    subtitle: roadmapDefinition.subtitle,
    note: roadmapDefinition.note,
    summary,
    phases,
  });
};
