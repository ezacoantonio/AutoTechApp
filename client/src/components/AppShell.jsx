import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/roadmap", label: "ASE Roadmap" },
  { to: "/topics", label: "Study Topics" },
  { to: "/categories", label: "Categories" },
  { to: "/case-notes", label: "Case Notes" },
  { to: "/notebooks", label: "Notebooks" },
  { to: "/recently-deleted", label: "Recently Deleted" },
];

const actionItems = [
  {
    to: "/topics/new",
    label: "Add Topic",
    variant: "button--ghost",
  },
  {
    to: "/case-notes/new",
    label: "Add Case Note",
    variant: "button--ghost",
  },
  {
    to: "/notebooks/new",
    label: "New Notebook",
    variant: "button--primary",
  },
];

function renderNavLinks(className, onNavigate) {
  return (
    <nav className={className} aria-label="Primary">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `${className.includes("mobile")
              ? "mobile-menu__link"
              : "site-nav__link"}${isActive ? " site-nav__link--active" : ""}`
          }
          onClick={onNavigate}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function renderActionLinks(className, onNavigate) {
  return (
    <div className={className}>
      {actionItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`button ${item.variant}`}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default function AppShell() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__top">
            <div className="brand-block">
              <p className="brand-eyebrow">Pocket Diagnostic Workspace</p>
              <Link to="/" className="brand-mark">
                Mechanic Mindset
              </Link>
              <p className="brand-copy">
                Study systems, capture real case lessons, and build
                notebook-style references that stay easy to use on the shop
                floor.
              </p>
            </div>

            <button
              type="button"
              className={`mobile-menu-toggle${mobileMenuOpen ? " mobile-menu-toggle--open" : ""}`}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu-panel"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((current) => !current)}
            >
              <span className="mobile-menu-toggle__bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="mobile-menu-toggle__label">
                {mobileMenuOpen ? "Close" : "Menu"}
              </span>
            </button>
          </div>

          <div className="site-header__desktop">
            {renderNavLinks("site-nav site-nav--desktop")}
            {renderActionLinks("site-actions site-actions--desktop")}
          </div>

          {mobileMenuOpen ? (
            <div id="mobile-menu-panel" className="mobile-menu-panel">
              {renderNavLinks("mobile-menu mobile-menu__nav", () =>
                setMobileMenuOpen(false)
              )}
              {renderActionLinks("mobile-menu mobile-menu__actions", () =>
                setMobileMenuOpen(false)
              )}
            </div>
          ) : null}
        </div>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
