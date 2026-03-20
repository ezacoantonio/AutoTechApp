export const ROADMAP_STEP_IDS = {
  diagnosticWorkflow: "diagnostic-workflow",
  scanDataStrategy: "scan-data-strategy",
  powerGroundIntegrity: "power-ground-integrity",
  sensorCircuitBasics: "sensor-circuit-basics",
  airMeteringFuelTrim: "air-metering-fuel-trim",
  ignitionMisfireStrategy: "ignition-misfire-strategy",
  coolingSystemControl: "cooling-system-control",
  engineMechanicalHealth: "engine-mechanical-health",
  hydraulicBrakeDiagnosis: "hydraulic-brake-diagnosis",
  absSignalAnalysis: "abs-signal-analysis",
  steeringSuspensionInspection: "steering-suspension-inspection",
  alignmentReasoning: "alignment-reasoning",
  transmissionShiftLogic: "transmission-shift-logic",
  drivetrainNoiseVibration: "drivetrain-noise-vibration",
  hvacAirDeliveryTemperature: "hvac-air-delivery-temperature",
  networkModuleBasics: "network-and-module-basics",
};

export const roadmapDefinition = {
  title: "ASE-Style Technician Roadmap",
  subtitle:
    "A diagnostics-first, exam-style study path built for hands-on automotive learning.",
  note:
    "This roadmap is inspired by ASE-style domain thinking and readiness planning. It is not official ASE content.",
  phases: [
    {
      id: "phase-diagnostic-foundations",
      title: "Phase 1: Diagnostic Foundations",
      description:
        "Build the habits and electrical test logic that support every other system in the vehicle.",
      domains: [
        {
          id: "domain-core-diagnostic-process",
          title: "Core Diagnostic Process",
          description:
            "Learn how to move from complaint to proof without guessing parts.",
          steps: [
            {
              id: ROADMAP_STEP_IDS.diagnosticWorkflow,
              title: "Complaint-To-Confirmation Workflow",
              objective:
                "Create a repeatable process for verifying concerns, narrowing causes, and confirming repairs.",
              examFocus:
                "Symptom analysis, inspection flow, and final verification discipline.",
              suggestedAction:
                "Build topics and case notes that show how you move from symptom to confirmed cause.",
              categoryHints: ["Diagnostics"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 0 },
            },
            {
              id: ROADMAP_STEP_IDS.scanDataStrategy,
              title: "DTC, Freeze Frame, And Scan Data Strategy",
              objective:
                "Interpret codes and live data as clues, not automatic part replacements.",
              examFocus:
                "Code interpretation, baseline data reading, and data-driven test planning.",
              suggestedAction:
                "Study a scan-data topic and pair it with a case note where data changed your diagnostic direction.",
              categoryHints: ["Diagnostics", "Engine Systems"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 0 },
            },
          ],
        },
        {
          id: "domain-electrical-test-strategy",
          title: "Electrical Test Strategy",
          description:
            "Build confidence with circuits, voltage drop, and signal interpretation before chasing advanced faults.",
          steps: [
            {
              id: ROADMAP_STEP_IDS.powerGroundIntegrity,
              title: "Power, Ground, And Voltage Drop Integrity",
              objective:
                "Prove circuit quality under load and identify high-resistance faults with confidence.",
              examFocus:
                "Voltage drop, loaded testing, connector faults, and circuit integrity logic.",
              suggestedAction:
                "Create a notebook playbook for voltage drop tests, then support it with topics and case evidence.",
              categoryHints: ["Electrical Systems", "Diagnostics"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 1 },
            },
            {
              id: ROADMAP_STEP_IDS.sensorCircuitBasics,
              title: "Sensor Reference, Signal, And Ground Basics",
              objective:
                "Understand how sensors are powered, grounded, and interpreted before condemning components.",
              examFocus:
                "Reference voltage checks, signal interpretation, and sensor circuit fault isolation.",
              suggestedAction:
                "Link a diagnostic topic, a real fault story, and a quick-reference notebook note for sensor circuits.",
              categoryHints: ["Electrical Systems", "Fuel and Air Systems"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 1 },
            },
          ],
        },
      ],
    },
    {
      id: "phase-engine-driveability",
      title: "Phase 2: Engine And Driveability Mastery",
      description:
        "Apply diagnostic habits to air, fuel, ignition, cooling, and mechanical condition.",
      domains: [
        {
          id: "domain-engine-performance",
          title: "Engine Performance",
          description:
            "Focus on fuel, air, and ignition systems that drive common driveability complaints.",
          steps: [
            {
              id: ROADMAP_STEP_IDS.airMeteringFuelTrim,
              title: "Air Metering And Fuel Trim Reasoning",
              objective:
                "Use airflow, leaks, and fuel trim behavior to diagnose lean and rich conditions accurately.",
              examFocus:
                "MAF interpretation, air leaks, fuel trim trends, and sensor cross-checking.",
              suggestedAction:
                "Study one air/fuel metering topic and pair it with a case note that proves the root cause.",
              categoryHints: ["Fuel and Air Systems", "Diagnostics"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 0 },
            },
            {
              id: ROADMAP_STEP_IDS.ignitionMisfireStrategy,
              title: "Ignition And Misfire Strategy",
              objective:
                "Separate ignition, fuel, and mechanical causes when chasing misfires.",
              examFocus:
                "Misfire counters, coil testing, plug inspection, and isolation strategy.",
              suggestedAction:
                "Build a misfire topic and a real repair case that shows how you ruled competing causes in or out.",
              categoryHints: ["Electrical Systems", "Engine Systems"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 0 },
            },
          ],
        },
        {
          id: "domain-engine-cooling-fundamentals",
          title: "Engine / Cooling Fundamentals",
          description:
            "Learn to confirm whether a complaint is thermal, control-related, or mechanical at the engine level.",
          steps: [
            {
              id: ROADMAP_STEP_IDS.coolingSystemControl,
              title: "Cooling System Control And Overheat Diagnosis",
              objective:
                "Diagnose thermostat, flow, fan, and bleed issues without guessing at major parts.",
              examFocus:
                "Coolant flow logic, temperature behavior, and overheat pattern recognition.",
              suggestedAction:
                "Tie a cooling topic to a verified case note and capture your overheat workflow in a notebook if needed.",
              categoryHints: ["Cooling Systems", "Diagnostics"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 0 },
            },
            {
              id: ROADMAP_STEP_IDS.engineMechanicalHealth,
              title: "Base Engine Mechanical Health",
              objective:
                "Know when to move from electronic diagnosis into compression, timing, vacuum, or mechanical checks.",
              examFocus:
                "Mechanical condition screening, relative compression thinking, and fault separation.",
              suggestedAction:
                "Create a notebook note that compares driveability symptoms caused by mechanical faults versus control issues.",
              categoryHints: ["Engine Systems", "Diagnostics"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 1 },
            },
          ],
        },
      ],
    },
    {
      id: "phase-chassis-safety",
      title: "Phase 3: Chassis And Safety Systems",
      description:
        "Move into braking, steering, and suspension with the same evidence-first mindset.",
      domains: [
        {
          id: "domain-brakes",
          title: "Brakes",
          description:
            "Understand hydraulic, friction, and electronic brake behavior from symptom to repair.",
          steps: [
            {
              id: ROADMAP_STEP_IDS.hydraulicBrakeDiagnosis,
              title: "Hydraulic Brake Diagnosis",
              objective:
                "Separate friction wear, hydraulic faults, and mechanical drag complaints correctly.",
              examFocus:
                "Pedal feel interpretation, hydraulic restriction logic, and brake service verification.",
              suggestedAction:
                "Capture one brake topic and one case note that explains how you proved the failure source.",
              categoryHints: ["Brakes"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 0 },
            },
            {
              id: ROADMAP_STEP_IDS.absSignalAnalysis,
              title: "ABS And Wheel Speed Signal Analysis",
              objective:
                "Use scan data and sensor inspection to isolate wheel speed and ABS faults accurately.",
              examFocus:
                "Wheel speed comparison, sensor signal reasoning, and electronic brake fault isolation.",
              suggestedAction:
                "Build a short notebook note for ABS signal comparison patterns after you create a topic and case link.",
              categoryHints: ["Brakes", "Electrical Systems"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 1 },
            },
          ],
        },
        {
          id: "domain-steering-suspension",
          title: "Suspension / Steering",
          description:
            "Develop inspection habits and reasoning around handling complaints and chassis wear.",
          steps: [
            {
              id: ROADMAP_STEP_IDS.steeringSuspensionInspection,
              title: "Steering And Suspension Inspection Logic",
              objective:
                "Build a systematic inspection path for looseness, noise, wear, and ride complaints.",
              examFocus:
                "Component play detection, wear pattern recognition, and steering complaint isolation.",
              suggestedAction:
                "Record one case note that documents your inspection logic from complaint to confirmed worn part.",
              categoryHints: ["Suspension and Steering"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 0 },
            },
            {
              id: ROADMAP_STEP_IDS.alignmentReasoning,
              title: "Alignment Angles And Tire Wear Reasoning",
              objective:
                "Understand how tire wear and pull complaints relate to alignment, suspension, and steering faults.",
              examFocus:
                "Camber, caster, toe, tire wear patterns, and pre-alignment inspection thinking.",
              suggestedAction:
                "Capture a notebook reference for tire wear patterns and pair it with related topic and case evidence.",
              categoryHints: ["Suspension and Steering"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 1 },
            },
          ],
        },
      ],
    },
    {
      id: "phase-powertrain-advanced",
      title: "Phase 4: Powertrain And Advanced Readiness",
      description:
        "Extend the same diagnostic discipline into drivetrain behavior, comfort systems, and electronic complexity.",
      domains: [
        {
          id: "domain-transmission-drivetrain",
          title: "Transmission / Drivetrain Fundamentals",
          description:
            "Focus on symptom isolation, fluid logic, and confirming faults before condemning major assemblies.",
          steps: [
            {
              id: ROADMAP_STEP_IDS.transmissionShiftLogic,
              title: "Transmission Shift Logic And Complaint Isolation",
              objective:
                "Separate control strategy, hydraulic issues, and mechanical transmission faults at a basic working-tech level.",
              examFocus:
                "Shift complaints, fluid condition, scan data interpretation, and test planning.",
              suggestedAction:
                "Use one topic and one case note to document how you narrowed a shift-quality complaint.",
              categoryHints: ["Transmission", "Diagnostics"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 0 },
            },
            {
              id: ROADMAP_STEP_IDS.drivetrainNoiseVibration,
              title: "Drivetrain Noise, Vibration, And Load Clues",
              objective:
                "Use operating conditions and load changes to isolate driveline, wheel-end, and mounting issues.",
              examFocus:
                "NVH reasoning, test-drive strategy, and cause isolation by condition changes.",
              suggestedAction:
                "Capture a structured case note for any vibration or drivetrain complaint you diagnose in the field.",
              categoryHints: ["Transmission", "Suspension and Steering"],
              evidenceTargets: { topics: 1, caseNotes: 1, notebooks: 0 },
            },
          ],
        },
        {
          id: "domain-hvac-advanced-gaps",
          title: "HVAC / Advanced Gaps",
          description:
            "Keep placeholders for systems that expand your diagnostic range even if your current library is still thin.",
          steps: [
            {
              id: ROADMAP_STEP_IDS.hvacAirDeliveryTemperature,
              title: "HVAC Air Delivery And Temperature Control",
              objective:
                "Understand the basic path for diagnosing airflow, blend, and temperature complaints.",
              examFocus:
                "Control head commands, blend door reasoning, and air delivery verification.",
              suggestedAction:
                "Create one starter topic and one notebook note as placeholders for HVAC diagnosis until real cases build up.",
              categoryHints: ["Diagnostics"],
              evidenceTargets: { topics: 1, caseNotes: 0, notebooks: 1 },
            },
            {
              id: ROADMAP_STEP_IDS.networkModuleBasics,
              title: "Network And Module Communication Basics",
              objective:
                "Recognize when a no-communication or module fault requires network thinking instead of isolated component testing.",
              examFocus:
                "Module communication basics, topology awareness, and diagnostic boundaries for newer vehicles.",
              suggestedAction:
                "Use a notebook note to collect network fundamentals and attach topics or cases as your experience grows.",
              categoryHints: ["Electrical Systems", "Diagnostics"],
              evidenceTargets: { topics: 1, caseNotes: 0, notebooks: 1 },
            },
          ],
        },
      ],
    },
  ],
};

const allRoadmapSteps = roadmapDefinition.phases.flatMap((phase) =>
  phase.domains.flatMap((domain) =>
    domain.steps.map((step) => ({
      ...step,
      phaseId: phase.id,
      phaseTitle: phase.title,
      domainId: domain.id,
      domainTitle: domain.title,
    }))
  )
);

export const roadmapStepIdSet = new Set(allRoadmapSteps.map((step) => step.id));
export const roadmapStepsById = new Map(
  allRoadmapSteps.map((step) => [step.id, step])
);

export const getAllRoadmapSteps = () => allRoadmapSteps.map((step) => ({ ...step }));
