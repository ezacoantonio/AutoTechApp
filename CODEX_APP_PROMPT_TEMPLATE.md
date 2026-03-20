# Codex App Prompt Template

Use this prompt at the start of a new Codex project when you want the same build structure, design standards, and engineering style as Mechanic Mindset.

Replace the `NEW APP IDEA` section with the actual product idea before sending it.

```text
Act as a senior full-stack software architect and engineer.

I want to build a new web app, but I want it to follow the same overall setup, structure, design quality, and development standards as my Mechanic Mindset project.

Before writing any code, go into planning mode first.

PHASE 1 - PLANNING MODE
Do not generate code immediately.
First, create a clear and detailed implementation plan for the app.

Your planning mode must include:

1. Product overview
- Explain what the app does in simple terms
- Define the main goal
- Define the target user clearly

2. Core MVP features only
- Identify only the essential features
- Avoid unnecessary or advanced features
- Keep the app lightweight, simple, maintainable, and fast

3. User flow
- Show how a user moves through the app step by step
- Explain each screen and what the user does there

4. Technical architecture
- Use the same professional but simple MERN-style structure as my previous app
- Web-based only
- Easy to run locally and easy to deploy later
- Avoid heavy infrastructure unless truly needed

5. Folder structure
- Organize the project into `client` and `server`
- Show the complete folder structure before coding

6. Database design
- Define the minimum data models needed
- Keep the schema simple and scalable
- Only include fields necessary for the MVP

7. API design
- List the backend routes needed
- Explain what each route does
- Keep the API clean and minimal

8. Frontend component structure
- List the pages and reusable components
- Keep the UI simple, clean, mobile friendly, and polished

9. Development phases
- Break the build into clear phases
- Wait for approval after showing the plan

10. Simplicity guardrails
- Explicitly mention what should NOT be built in the MVP
- Avoid overengineering
- Avoid complex dashboards, microservices, advanced AI pipelines, heavy analytics, or unnecessary third-party systems unless I ask later

Build requirements:
- Use a `client` and `server` directory
- React frontend
- Vite
- React Router
- Node.js + Express backend
- MongoDB with Mongoose
- Reusable React components
- No Redux unless truly necessary
- Use Express middleware properly
- Use `helmet`
- Auth only if truly needed; otherwise explain why it should be skipped
- Keep the code easy to debug and maintain
- Prepare the app to be deployable on Render

UI requirements:
- Use the same design direction as my previous app
- Mobile-first and desktop-friendly
- On mobile, use a hamburger navigation pattern
- Keep the UI fast, clean, modern, and intentional
- Use the same visual language: strong red accents, silver or metallic surfaces, and dark charcoal structure
- Professional, minimal, and not overloaded
- Use subtle but meaningful animation, not noisy effects

Engineering requirements:
- Keep the app lightweight and fast
- No admin dashboard
- No payments
- No social features
- No unnecessary AI integrations in v1
- No complicated analytics unless I explicitly ask for them
- Focus on clean functionality and strong structure

When implementation begins:
- Generate complete code, not partial snippets
- Provide full files
- Clearly label each file path
- Make the code copy-paste ready
- Make sure all imports and exports are correct
- Keep the app working end to end
- Explain how to run both client and server
- Include package installation commands
- Include environment variables needed
- Include sample seed data if useful

Workflow:
- Step 1: Give me the full in-depth plan only
- Step 2: Wait for my approval
- Step 3: After approval, build the app phase by phase
- Step 4: Keep every phase lightweight and functional

NEW APP IDEA
[Replace this section with the new app idea, purpose, users, core MVP features, and any special rules.]

Use the context below as the project standard and preserve that structure, feel, and engineering style unless I explicitly tell you to change it:
[Paste the contents of CODEX_PROJECT_CONTEXT_TEMPLATE.md here]
```

