import { useEffect, useState } from "react";

const sectionLabels = {
  home: "Home",
  roadmap: "ASE Roadmap",
  topics: "Study Topics",
  caseNotes: "Case Notes",
  notebooks: "Notebooks",
  categories: "Categories",
  recentlyDeleted: "Recently Deleted",
  other: "Other",
};

const getLocalDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const getRecentDays = (daily, numberOfDays = 7) =>
  Array.from({ length: numberOfDays }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (numberOfDays - index - 1));
    const key = getLocalDateKey(date);
    const bucket = daily[key] || {
      visits: 0,
      studySeconds: 0,
    };

    return {
      key,
      label: date.toLocaleDateString(undefined, {
        weekday: "short",
      }),
      minutes: Math.round(bucket.studySeconds / 60),
      visits: bucket.visits,
    };
  });

const getCurrentStreak = (daily) => {
  let streak = 0;

  for (let dayOffset = 0; dayOffset < 60; dayOffset += 1) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    const bucket = daily[getLocalDateKey(date)];

    if (!bucket || (bucket.visits ?? 0) === 0) {
      break;
    }

    streak += 1;
  }

  return streak;
};

const getTopSection = (sectionSeconds, sectionViews) =>
  Object.keys(sectionLabels)
    .map((key) => ({
      key,
      score: sectionSeconds[key] || sectionViews[key] || 0,
    }))
    .sort((left, right) => right.score - left.score)[0]?.key || "topics";

const formatStudyTime = (seconds) => {
  if (seconds <= 0) {
    return "0m";
  }

  const hours = seconds / 3600;

  if (hours >= 1) {
    return `${hours.toFixed(hours >= 10 ? 0 : 1)}h`;
  }

  return `${Math.max(1, Math.round(seconds / 60))}m`;
};

function AnimatedValue({ value, suffix = "", decimals = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId = 0;
    const startValue = displayValue;
    const startTime = performance.now();
    const duration = 850;

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextValue = startValue + (value - startValue) * easedProgress;

      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animate);
      }
    };

    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return `${displayValue.toFixed(decimals)}${suffix}`;
}

function ActivityMetric({
  title,
  value,
  subtitle,
  suffix = "",
  decimals = 0,
}) {
  return (
    <article className="tracker-card tracker-card--metric">
      <p className="section-heading__eyebrow">{title}</p>
      <div className="tracker-metric__value">
        <AnimatedValue value={value} suffix={suffix} decimals={decimals} />
      </div>
      <p className="tracker-metric__subtitle">{subtitle}</p>
    </article>
  );
}

function WeeklyStudyChart({ daily }) {
  const points = getRecentDays(daily, 7);
  const maxMinutes = Math.max(...points.map((point) => point.minutes), 1);

  return (
    <article className="tracker-card tracker-card--chart">
      <div className="tracker-card__header">
        <div>
          <p className="section-heading__eyebrow">Study Time Trend</p>
          <h3>Last 7 days</h3>
        </div>
      </div>
      <div className="activity-bars">
        {points.map((point) => (
          <div key={point.key} className="activity-bars__item">
            <span className="activity-bars__value">{point.minutes}m</span>
            <div className="activity-bars__track">
              <span
                className="activity-bars__fill"
                style={{
                  "--bar-scale": String(point.minutes / maxMinutes),
                }}
              />
            </div>
            <span className="activity-bars__label">{point.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function SectionFocusChart({ sectionSeconds, sectionViews }) {
  const rows = Object.keys(sectionLabels)
    .map((key) => ({
      key,
      label: sectionLabels[key],
      seconds: sectionSeconds[key] || 0,
      visits: sectionViews[key] || 0,
    }))
    .filter((row) => row.seconds > 0 || row.visits > 0)
    .sort(
      (left, right) => right.seconds - left.seconds || right.visits - left.visits
    )
    .slice(0, 4);

  const maxSeconds = Math.max(...rows.map((row) => row.seconds), 1);

  return (
    <article className="tracker-card tracker-card--chart">
      <div className="tracker-card__header">
        <div>
          <p className="section-heading__eyebrow">Focus Breakdown</p>
          <h3>Where your study time is going</h3>
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="focus-list">
          {rows.map((row) => (
            <div key={row.key} className="focus-list__row">
              <div className="focus-list__meta">
                <span>{row.label}</span>
                <span>
                  {formatStudyTime(row.seconds)} / {row.visits} views
                </span>
              </div>
              <div className="focus-list__track">
                <span
                  className="focus-list__fill"
                  style={{
                    "--bar-width": `${Math.max(
                      12,
                      (row.seconds / maxSeconds) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="tracker-card__empty">
          Open study sections and spend a little time in the app to start seeing
          focus data here.
        </p>
      )}
    </article>
  );
}

export default function StudyActivityDashboard({ activity }) {
  const today = activity.daily[getLocalDateKey()] || {
    visits: 0,
    studySeconds: 0,
  };
  const weeklyPoints = getRecentDays(activity.daily, 7);
  const weeklyMinutes = weeklyPoints.reduce((sum, point) => sum + point.minutes, 0);
  const streak = getCurrentStreak(activity.daily);
  const topSection = getTopSection(activity.sectionSeconds, activity.sectionViews);
  const totalPageViews = Object.values(activity.sectionViews).reduce(
    (sum, value) => sum + value,
    0
  );

  return (
    <section className="panel tracker-panel">
      <div className="section-heading section-heading--hero">
        <div>
          <p className="section-heading__eyebrow">Participation Tracker</p>
          <h2>See your study habit build over time.</h2>
          <p className="section-heading__text">
            This tracker is lightweight and personal-use friendly. It measures
            your visits, study time, and section activity locally in your
            browser so you can stay consistent without setting up accounts or
            heavy analytics.
          </p>
        </div>
        <div className="tracker-badge">
          <span className="tracker-badge__label">Top focus</span>
          <span className="tracker-badge__value">{sectionLabels[topSection]}</span>
        </div>
      </div>

      <div className="tracker-metric-grid">
        <ActivityMetric
          title="App Visits"
          value={activity.totalVisits}
          subtitle="Total times you've opened a study session"
        />
        <ActivityMetric
          title="Study Time"
          value={Number((activity.totalStudySeconds / 3600).toFixed(1))}
          suffix="h"
          decimals={1}
          subtitle="Approximate total visible time spent in the app"
        />
        <ActivityMetric
          title="Active Streak"
          value={streak}
          subtitle="Consecutive days with participation"
        />
        <ActivityMetric
          title="This Week"
          value={weeklyMinutes}
          suffix="m"
          subtitle="Tracked minutes across the last 7 days"
        />
      </div>

      <div className="tracker-layout">
        <WeeklyStudyChart daily={activity.daily} />
        <SectionFocusChart
          sectionSeconds={activity.sectionSeconds}
          sectionViews={activity.sectionViews}
        />
      </div>

      <div className="tracker-footer">
        <div className="tracker-insight">
          <span className="tracker-insight__label">Today</span>
          <span className="tracker-insight__value">
            {today.visits} visits / {formatStudyTime(today.studySeconds)}
          </span>
        </div>
        <div className="tracker-insight">
          <span className="tracker-insight__label">Page Views</span>
          <span className="tracker-insight__value">{totalPageViews} tracked views</span>
        </div>
        <div className="tracker-insight">
          <span className="tracker-insight__label">Last Activity</span>
          <span className="tracker-insight__value">
            {activity.lastVisitAt
              ? new Intl.DateTimeFormat(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                }).format(new Date(activity.lastVisitAt))
              : "Start exploring to begin tracking"}
          </span>
        </div>
      </div>
    </section>
  );
}
