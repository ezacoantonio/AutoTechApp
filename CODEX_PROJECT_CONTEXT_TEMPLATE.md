# Codex Project Context Template

Use this file as the reusable project context block for future Codex builds when you want the same standards and setup as Mechanic Mindset.

```text
PROJECT CONTEXT - REUSE THIS APP BLUEPRINT

I want this new project to follow the same blueprint, standards, and structure as my Mechanic Mindset app.

APP BLUEPRINT
- Full-stack web app
- Lightweight personal-use-first architecture
- Built for local development first, deployment second
- Maintainable, readable, and easy to extend later
- No overengineering

STACK
- Frontend: React + Vite
- Routing: React Router
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Security: helmet
- Client/server split with separate directories
- Render-ready deployment structure
- MongoDB Atlas for production database
- Cloudinary only when image upload is truly needed
- No Redux unless complexity clearly justifies it

PROJECT STRUCTURE
- Root project folder
- `client/`
- `server/`
- Root README
- Root `render.yaml`
- `.env.example` files for client and server
- Clear separation of:
  - models
  - controllers
  - routes
  - middleware
  - config
  - reusable frontend components
  - pages
  - utilities
  - seed data if helpful

BACKEND STANDARDS
- Keep API minimal and clean
- Use controller-based route organization
- Use Mongoose models with simple schemas
- Validate incoming payloads
- Use reusable error handling middleware
- Use a health route
- Support easy local dev
- Keep business logic readable and direct
- Avoid service over-abstraction unless it actually improves clarity
- Prefer soft delete only where it improves user workflow
- Avoid heavy auth or permissions unless the app truly needs it

FRONTEND STANDARDS
- Mobile-first layout
- Desktop-friendly scaling
- Reusable form and card components
- Simple list/detail/create/edit flows
- Clean route structure
- Native fetch-style API helpers are preferred for lightweight apps
- Use local/component state by default
- Keep pages readable and fast
- Avoid unnecessary state libraries
- Forms should be practical and easy to maintain

UI / DESIGN DIRECTION
- Keep the same visual language and level of polish
- Main palette:
  - red accents
  - silver or metallic surfaces
  - dark charcoal structure
- Clean, modern, focused layout
- Strong spacing and readable typography
- Professional but simple
- Avoid clutter
- Avoid generic-looking UI
- Use subtle animation and transitions only where helpful
- Mobile should feel intentionally designed, not like a shrunk desktop page
- Use hamburger navigation on iPhone/mobile layouts
- Preserve good contrast and comfortable tap targets

PRODUCT PHILOSOPHY
- Build the minimum useful product first
- Focus on real workflow value
- Avoid platform thinking too early
- Avoid admin dashboards, subscriptions, social features, and complex analytics in v1
- Avoid microservices
- Avoid advanced AI systems unless explicitly requested later
- Keep the app single-purpose and sharp

DEVELOPMENT WORKFLOW
- Always start in planning mode unless I ask for direct implementation
- Break the build into phases
- Explain the architecture before coding
- Then implement phase by phase
- Keep each phase working end to end
- Prefer a complete, functional vertical slice over scattered partial work

DELIVERY EXPECTATIONS
- Generate complete code, not fragments
- Full files with correct imports and exports
- Code should be copy-paste ready
- Include run instructions
- Include env var instructions
- Include sample seed data when useful
- Keep the app deployable on Render

RENDER / DEPLOYMENT DEFAULTS
- Separate frontend and backend services
- Render static site for frontend
- Render web service for backend
- MongoDB Atlas in production
- Environment variables documented clearly
- CORS configured cleanly for local and deployed frontend origins

IF NOTEBOOK OR DOCUMENT FEATURES EXIST
- Prefer lightweight document-style editing
- Support create, read, edit, delete
- Support image attachments only if needed
- Export features should stay simple
- Do not turn it into a full enterprise editor unless explicitly requested

IF PROGRESS OR TRACKING FEATURES EXIST
- Keep them lightweight first
- Local or browser-based tracking is acceptable for v1 unless cross-device persistence is required
- Use simple charts and clear metrics
- Keep tracking understandable and actionable

DEFAULT ENGINEERING TONE
- Senior-level, practical, and structured
- Simplicity first
- Production-minded, but not overbuilt
- Clean UX, clean code, clear folder organization
```

