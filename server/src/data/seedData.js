import { DEFAULT_CATEGORY_NAMES } from "../constants/categories.js";

export const seedCategories = DEFAULT_CATEGORY_NAMES.map((name) => ({
  name,
  description: `Core study area for ${name.toLowerCase()}.`,
}));

export const seedTopics = [
  {
    title: "Mass Air Flow Sensor",
    category: "Fuel and Air Systems",
    whatItIs:
      "The mass air flow sensor measures how much air is entering the engine so the PCM can calculate the correct fuel delivery.",
    commonFailures:
      "Contamination on the sensing element, damaged wiring, intake leaks after the sensor, or total sensor failure are common issues.",
    symptoms:
      "Rough idle, hesitation, poor fuel economy, lean codes, and weak acceleration are common signs of a MAF problem.",
    diagnosis:
      "Inspect the air intake path, check the connector and wiring, look at scan data for grams-per-second readings, and compare the values to engine load and RPM.",
    recommendedFix:
      "Repair wiring or intake leaks first, clean the sensor only if appropriate, and replace the sensor if readings stay incorrect.",
  },
  {
    title: "Thermostat",
    category: "Cooling Systems",
    whatItIs:
      "The thermostat regulates coolant flow to help the engine reach operating temperature quickly and stay in the correct range.",
    commonFailures:
      "Thermostats commonly stick open or closed because of age, corrosion, or debris in the cooling system.",
    symptoms:
      "A stuck-open thermostat can cause slow warm-up and weak heater output, while a stuck-closed thermostat can cause overheating.",
    diagnosis:
      "Verify coolant level, monitor live coolant temperature, feel the upper radiator hose during warm-up, and confirm whether coolant flow starts too early or too late.",
    recommendedFix:
      "Replace the thermostat and gasket, refill with the correct coolant, and bleed air from the cooling system afterward.",
  },
  {
    title: "Ignition Coil",
    category: "Electrical Systems",
    whatItIs:
      "An ignition coil converts battery voltage into the high voltage needed to fire the spark plug.",
    commonFailures:
      "Heat damage, cracked coil housing, moisture intrusion, and internal winding failure can all cause weak or missing spark.",
    symptoms:
      "Misfire under load, rough idle, hard starting, flashing check-engine light, and fuel smell from unburned fuel are common indicators.",
    diagnosis:
      "Check for misfire codes, swap coils between cylinders if possible, inspect the plug well for oil or water, and verify power and ground at the connector.",
    recommendedFix:
      "Replace the failed coil, inspect the related spark plug, and repair any oil leak or moisture source that may have damaged the coil.",
  },
];

export const seedCaseNotes = [
  {
    vehicle: "2014 Honda Civic 1.8L",
    problem: "Engine stumbled on acceleration and set a lean condition code.",
    cause:
      "A split intake boot after the MAF sensor was allowing unmetered air into the engine.",
    fix:
      "Replaced the damaged boot, cleared the code, and confirmed fuel trims returned to normal.",
    lessonLearned:
      "Always inspect the air intake path before replacing a sensor that looks suspicious in the scan data.",
  },
  {
    vehicle: "2012 Ford Escape 3.0L",
    problem: "Customer complaint was overheating after 15 minutes of driving.",
    cause:
      "The thermostat was stuck closed, preventing normal coolant circulation.",
    fix:
      "Installed a new thermostat and gasket, refilled coolant, and bled the system.",
    lessonLearned:
      "Watch the temperature climb pattern and compare hose temperature to confirm flow problems before condemning the water pump.",
  },
];

export const seedNotebooks = [
  {
    title: "Electrical Diagnostics Playbook",
    summary:
      "Quick-reference notebook for tracing power, ground, and signal faults in real-world diagnostic work.",
    chapters: [
      {
        title: "Voltage Drop Basics",
        content:
          "Use voltage drop testing under load to confirm high resistance on power or ground sides before replacing parts. The circuit has to be working for the test to mean anything.",
        image: {
          url: "",
          publicId: "",
          width: null,
          height: null,
          format: "",
          originalFilename: "",
        },
      },
      {
        title: "Connector Inspection Checklist",
        content:
          "Look for spread terminals, backed-out pins, corrosion, heat damage, and signs of water intrusion. Tug lightly on suspect wires and compare pin tension side to side.",
        image: {
          url: "",
          publicId: "",
          width: null,
          height: null,
          format: "",
          originalFilename: "",
        },
      },
    ],
  },
];
