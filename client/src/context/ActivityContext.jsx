import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

const ActivityContext = createContext(null);
const STORAGE_KEY = "mechanic-mindset-activity-v1";
const SESSION_KEY = "mechanic-mindset-session-started";
const TRACK_INTERVAL_SECONDS = 15;

const sectionKeys = [
  "home",
  "topics",
  "caseNotes",
  "notebooks",
  "categories",
  "recentlyDeleted",
  "other",
];

const createSectionRecord = () =>
  Object.fromEntries(sectionKeys.map((key) => [key, 0]));

const createEmptyActivity = () => ({
  totalVisits: 0,
  totalStudySeconds: 0,
  lastVisitAt: null,
  sectionViews: createSectionRecord(),
  sectionSeconds: createSectionRecord(),
  daily: {},
});

const getLocalDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const readStoredActivity = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createEmptyActivity();
    }

    const parsed = JSON.parse(raw);

    return {
      ...createEmptyActivity(),
      ...parsed,
      sectionViews: {
        ...createSectionRecord(),
        ...(parsed.sectionViews || {}),
      },
      sectionSeconds: {
        ...createSectionRecord(),
        ...(parsed.sectionSeconds || {}),
      },
      daily: parsed.daily || {},
    };
  } catch {
    return createEmptyActivity();
  }
};

const writeStoredActivity = (activity) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activity));
};

const getSectionKey = (pathname) => {
  if (pathname === "/") {
    return "home";
  }

  if (pathname.startsWith("/topics")) {
    return "topics";
  }

  if (pathname.startsWith("/case-notes")) {
    return "caseNotes";
  }

  if (pathname.startsWith("/notebooks")) {
    return "notebooks";
  }

  if (pathname.startsWith("/categories")) {
    return "categories";
  }

  if (pathname.startsWith("/recently-deleted")) {
    return "recentlyDeleted";
  }

  return "other";
};

const ensureDayBucket = (activity, dayKey) => ({
  visits: 0,
  studySeconds: 0,
  sectionViews: createSectionRecord(),
  sectionSeconds: createSectionRecord(),
  ...(activity.daily[dayKey] || {}),
});

const incrementVisit = (activity, sectionKey) => {
  const dayKey = getLocalDateKey();
  const dayBucket = ensureDayBucket(activity, dayKey);

  return {
    ...activity,
    totalVisits: activity.totalVisits + 1,
    lastVisitAt: new Date().toISOString(),
    sectionViews: {
      ...activity.sectionViews,
      [sectionKey]: activity.sectionViews[sectionKey] + 1,
    },
    daily: {
      ...activity.daily,
      [dayKey]: {
        ...dayBucket,
        visits: dayBucket.visits + 1,
        sectionViews: {
          ...dayBucket.sectionViews,
          [sectionKey]: dayBucket.sectionViews[sectionKey] + 1,
        },
      },
    },
  };
};

const trackSectionView = (activity, sectionKey) => {
  const dayKey = getLocalDateKey();
  const dayBucket = ensureDayBucket(activity, dayKey);

  return {
    ...activity,
    lastVisitAt: new Date().toISOString(),
    sectionViews: {
      ...activity.sectionViews,
      [sectionKey]: activity.sectionViews[sectionKey] + 1,
    },
    daily: {
      ...activity.daily,
      [dayKey]: {
        ...dayBucket,
        sectionViews: {
          ...dayBucket.sectionViews,
          [sectionKey]: dayBucket.sectionViews[sectionKey] + 1,
        },
      },
    },
  };
};

const trackStudyTime = (activity, sectionKey, seconds) => {
  const dayKey = getLocalDateKey();
  const dayBucket = ensureDayBucket(activity, dayKey);

  return {
    ...activity,
    totalStudySeconds: activity.totalStudySeconds + seconds,
    sectionSeconds: {
      ...activity.sectionSeconds,
      [sectionKey]: activity.sectionSeconds[sectionKey] + seconds,
    },
    daily: {
      ...activity.daily,
      [dayKey]: {
        ...dayBucket,
        studySeconds: dayBucket.studySeconds + seconds,
        sectionSeconds: {
          ...dayBucket.sectionSeconds,
          [sectionKey]: dayBucket.sectionSeconds[sectionKey] + seconds,
        },
      },
    },
  };
};

export function ActivityProvider({ children }) {
  const location = useLocation();
  const [activity, setActivity] = useState(() => readStoredActivity());

  const persistActivity = useEffectEvent((updater) => {
    setActivity((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      writeStoredActivity(next);
      return next;
    });
  });

  useEffect(() => {
    if (!window.sessionStorage.getItem(SESSION_KEY)) {
      window.sessionStorage.setItem(SESSION_KEY, "true");
      persistActivity((current) => incrementVisit(current, getSectionKey(location.pathname)));
      return;
    }

    persistActivity((current) => trackSectionView(current, getSectionKey(location.pathname)));
  }, [location.pathname, persistActivity]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }

      persistActivity((current) =>
        trackStudyTime(current, getSectionKey(window.location.pathname), TRACK_INTERVAL_SECONDS)
      );
    }, TRACK_INTERVAL_SECONDS * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [persistActivity]);

  return (
    <ActivityContext.Provider value={{ activity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);

  if (!context) {
    throw new Error("useActivity must be used inside ActivityProvider.");
  }

  return context;
}
