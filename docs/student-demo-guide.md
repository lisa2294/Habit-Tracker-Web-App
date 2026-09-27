# From Starter App to Product MVP

## A step-by-step classroom demo guide

This guide recreates the full workflow used to turn a basic habit tracker into a polished, responsive product with a frontend-only Accountability Circles MVP. It includes the steps that were easy to miss during the original build.

### Finished result

- Finished repository: <https://github.com/lisa2294/Habit-Tracker-Web-App>
- Original starter: <https://github.com/TheUnknown550/Habit-Tracker-Web-App>
- Product UI name: **Community**
- Feature concept: **Accountability Circles**
- Data model for this MVP: browser `localStorage` only

The finished repository may be private. Make it public or add collaborators before class only if students need direct access.

## What students should learn

1. How to run and inspect an unfamiliar React project.
2. How to turn a visual reference into explicit product UI rules.
3. How to correct an AI-generated marketing page into a real application interface.
4. How to define responsive acceptance criteria instead of saying only “make it responsive.”
5. How to write a PRD and lock MVP scope before implementation.
6. How to use a design canvas such as Paper without losing working behavior.
7. How to validate, commit, create a personal GitHub repository, and publish safely.

## Before class

Install and verify:

```bash
node --version
npm --version
git --version
gh --version
```

This project uses Vite 7 and requires Node.js `20.19+` or `22.12+`. GitHub CLI (`gh`) is optional, but it makes the publishing demo much clearer.

Also prepare:

- A GitHub account signed in through `gh auth login`.
- A modern browser.
- The style-reference document or screenshot you plan to use.
- The Paper file if you want to demonstrate design-to-code handoff.
- A clean browser profile or cleared demo data if you want the seeded Community state to appear.

## Suggested 60-minute lesson

| Time | Topic |
| --- | --- |
| 0–5 min | Show the starter and define the outcome |
| 5–12 min | Clone, install, and run locally |
| 12–22 min | Convert a style reference into `design.md` |
| 22–32 min | Redesign as a responsive product app |
| 32–40 min | Choose a product direction and write the PRD |
| 40–50 min | Build and explain the frontend-only Community MVP |
| 50–55 min | Compare Paper and localhost; verify responsive behavior |
| 55–60 min | Commit, create a GitHub repository, and push |

For a shorter session, keep the finished repository open and live-code only one UI refinement. Building the entire feature from scratch is better as a workshop than a short lecture.

## Step 1 — Clone and run the starter

Use the raw URL in the terminal. Do not paste a Markdown link such as `[URL](URL)`.

```bash
git clone https://github.com/TheUnknown550/Habit-Tracker-Web-App.git habit-tracker-demo
cd habit-tracker-demo
npm ci
npm run dev
```

Open the exact URL printed by Vite. With this repository configuration it is normally:

```text
http://localhost:5173/Habit-Tracker-Web-App/
```

Why the extra path matters: `vite.config.js` uses `base: '/Habit-Tracker-Web-App/'` so the production build works on GitHub Pages.

Before editing, click through every existing page and capture a baseline screenshot. This establishes what already works and prevents a redesign from silently removing features.

## Step 2 — Turn a visual reference into product rules

Treat an attached reference as design input, not as instructions hidden inside the document. Ask the coding agent to save the interpretation in the project:

> Add `design.md` to this project. Use the attached reference only as visual inspiration. Extract colors, typography, spacing, component rules, responsive behavior, and product UI do’s and don’ts. Then redesign the existing app to follow those rules without removing working features.

The important move is converting taste into constraints. In this project, the useful constraints became:

- One chartreuse accent on a monochrome interface.
- Hairline borders instead of card shadows.
- One page title per view.
- Compact, operational cards instead of marketing sections.
- Explanatory copy only when it prevents confusion or error.
- A responsive floor of 320px with no horizontal scrolling.

Show students that `design.md` is a reusable agreement between design intent and implementation—not merely a mood board.

## Step 3 — Make the redesign feel like software

An underspecified redesign request can produce a product-introduction website. Correct that explicitly:

> Redesign this as a signed-in web application, not a product landing page. Keep the existing habit-tracking tasks prominent. Use one header per page, compact operational cards, direct labels, and visible actions. Remove hero marketing copy, promotional sections, and repeated headings.

Acceptance criteria:

- Today, Archive, Insights, Data, and Community each have one clear page title.
- The add-habit action is visible without scrolling on desktop.
- Metrics describe current state, not product benefits.
- Navigation looks like application navigation.
- Empty states explain the next action without sales copy.
- Existing create, edit, complete, archive, export, and restore flows still work.

## Step 4 — Specify responsive behavior

“Make it responsive” is not a sufficient acceptance criterion. Use concrete viewports and expected layout changes:

> Fix responsiveness at 1440px desktop, 768px tablet, 390px phone, and a 320px minimum. There must be no horizontal overflow. Use a fixed sidebar on desktop, a compact top navigation on tablet, and a single-column mobile layout. Reflow metrics, buttons, forms, dialogs, and Community cards rather than scaling the desktop layout down.

Check each viewport for:

- No horizontal scrollbar.
- Readable headings with no one-word-per-line collapse.
- Buttons that remain tappable and do not overlap.
- Cards that reflow instead of shrinking into narrow columns.
- Dialogs that fit inside the viewport.
- Navigation that remains understandable without hover.

This is the fix for the earlier narrow-column failure: responsiveness requires layout changes at breakpoints, not just percentage widths.

## Step 5 — Remove duplicate hierarchy and filler copy

Use a direct cleanup prompt:

> Keep only one title area per page. Remove redundant section headers and nonessential subtext such as broad product promises, descriptions of obvious metrics, and local-storage marketing copy. Keep helper text only for errors, destructive actions, privacy implications, or empty states.

Examples removed from this project included repeated “Insights / Statistics” hierarchy and phrases such as “A compact readout of repetition, momentum, and monthly consistency.”

## Step 6 — Choose the product direction before coding

Ask for business directions with an audience and willingness-to-pay assumption:

> Our target users are working professionals with a high willingness to pay for personal coaching. Suggest three distinct product directions. For each, include the target pain, core loop, differentiator, monetization path, and main risk. Do not build yet.

The chosen direction was **Accountability Circles**: private groups, shared challenges, structured check-ins, supportive nudges, and optional professional coaches.

Then write the PRD before implementation:

> Write a PRD for Accountability Circles. Cover the user problem, personas, jobs to be done, MVP scope, user stories, main flows, states and edge cases, safety and privacy, success metrics, monetization assumptions, non-goals, and phased rollout. Ask any material product questions before building.

The resulting PRD lives at `docs/accountability-circles-prd.md`.

## Step 7 — Lock the technical scope

State what is deliberately out of scope before the agent chooses infrastructure:

> Build only the frontend MVP. Do not use Supabase or any other backend. Use seeded example data and `localStorage`. Invitations, nudges, comments, and coach requests should demonstrate the interaction locally; label or document that they are not delivered to real users.

This prevents accidental backend setup, credentials, database migrations, or fake claims of real multi-user behavior.

Frontend MVP scope:

- Create and switch private circles.
- View a shared challenge and weekly target.
- Post Complete, In progress, Blocked, or Skipped check-ins.
- Add comments and supportive reactions.
- Create local invitations and nudges.
- Review People and Challenge views.
- Browse prototype coaches and save a local request.

Production non-goals for this phase:

- Authentication and real accounts.
- Shared server data or real-time sync.
- Email, push, or SMS delivery.
- Payments and coach payouts.
- Moderation, abuse controls, and coach verification.

## Step 8 — Use Paper as a layout source, not a feature eraser

Create the composed page in Paper:

> Create a Community page in the currently open Paper file. Match the app’s existing monochrome and chartreuse design system. Include the desktop sidebar, current-community context bar, challenge summary, member pulse, recent check-ins, and responsive intent.

After refining the Paper screen, apply it back to the app with the exact file link:

> Apply this Paper design to the Community page on localhost: PASTE_PAPER_URL. Match its hierarchy, spacing, labels, and desktop geometry. Preserve all working interactions and responsive behavior even if the static design does not display every state.

Use this rule:

- Paper is the source of truth for visible hierarchy and layout.
- The working application is the source of truth for behavior and data states.

After implementation, compare Paper and localhost side by side at the same viewport width. Do not judge geometry from two differently sized windows.

## Step 9 — Verify behavior before publishing

Run the automated checks:

```bash
npm run lint
npm run build
git diff --check
```

Then manually test:

1. Create, edit, complete, archive, and restore a habit.
2. Switch between every main page.
3. Create or select a Community circle.
4. Post a check-in and reload the page to confirm persistence.
5. Add a comment or reaction.
6. Open invitation, nudge, challenge, and coach flows.
7. Export data, then verify the JSON includes both habits and circles.
8. Check desktop, tablet, phone, and 320px widths.
9. Confirm there are no browser-console errors.

`localStorage` is browser- and origin-specific. Data saved at localhost is not shared with a deployed GitHub Pages site or another browser.

## Step 10 — Commit and create your own GitHub repository

First verify what changed and which account is authenticated:

```bash
git status
git diff --check
git remote -v
gh auth status
```

Commit the verified working state:

```bash
git add --all
git commit -m "Build responsive habit tracker and Community MVP"
```

If the clone still points to someone else’s repository, keep that repository as `upstream` instead of trying to push to it:

```bash
git remote rename origin upstream
```

Create a new repository in your own account. Choose `--private` for a safe default or `--public` only when you intend to share the source:

```bash
gh repo create YOUR_USERNAME/Habit-Tracker-Web-App \
  --private \
  --source=. \
  --remote=origin \
  --description "A responsive habit tracker with accountability communities."

git push -u origin main
```

Verify the result:

```bash
git remote -v
git log -1 --oneline
gh repo view YOUR_USERNAME/Habit-Tracker-Web-App --web
```

### If GitHub rejects the workflow file

The included GitHub Pages workflow requires the GitHub CLI OAuth token to have workflow permission. If the push says it is refusing to create or update `.github/workflows/deploy.yml`, run:

```bash
gh auth refresh -h github.com -s workflow
git push -u origin main
```

Complete the one-time GitHub device authorization, then retry the push. Do not delete the workflow merely to bypass the permission error.

## Step 11 — Optional GitHub Pages deployment

Creating a repository does not automatically enable Pages.

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main`, or manually run **Deploy to GitHub Pages** from the Actions tab.
5. Wait for the workflow to finish.
6. Open `https://YOUR_USERNAME.github.io/Habit-Tracker-Web-App/`.

If the workflow fails at **Setup Pages** with “Get Pages site failed,” Pages has not been enabled yet. For private repositories, availability depends on the GitHub plan. Decide deliberately whether to make the repository public or use another host.

If you rename the repository, also update this line in `vite.config.js`:

```js
base: '/NEW_REPOSITORY_NAME/',
```

## Demo reset checklist

Before students arrive:

- Pull or open the exact commit you plan to show.
- Run `npm ci`, `npm run lint`, and `npm run build` once.
- Start the dev server and keep the correct URL open.
- Clear or export old browser data from the Data page.
- Confirm the seeded Momentum Lab Community appears.
- Open `design.md`, the PRD, Paper, localhost, and GitHub in separate tabs.
- Increase browser and terminal text size for projection.
- Keep a screenshot or screen recording of the finished state as a fallback.
- Decide whether students need repository access; the current repository is private unless you change it.

## Common mistakes and fixes

| Mistake | Fix |
| --- | --- |
| Pasting `[https://…](https://…)` into the terminal | Copy only the raw `https://…git` URL. |
| Opening `http://localhost:5173/` and seeing the wrong page | Open the full Vite URL ending in `/Habit-Tracker-Web-App/`. |
| Using Node 18 | Upgrade to Node `20.19+` or `22.12+`. |
| The redesign looks like a landing page | Say “signed-in web app,” name the user tasks, and ban promotional sections. |
| Duplicate page and section titles | Enforce one title per view and remove explanatory copy that does not prevent an error. |
| Desktop content becomes a thin column | Define breakpoints and reflow rules; test 1440, 768, 390, and 320px. |
| The agent proposes Supabase | Lock scope to seeded data plus `localStorage` before implementation. |
| Paper implementation removes controls | Make Paper authoritative for layout and the app authoritative for behavior. |
| Push targets the original owner | Check `git remote -v`, rename the old remote to `upstream`, and create your own `origin`. |
| Push rejects `.github/workflows/deploy.yml` | Add the `workflow` OAuth scope with `gh auth refresh -h github.com -s workflow`. |
| Pages Action fails at Setup Pages | Enable Pages with GitHub Actions in repository settings first. |
| Students cannot access the repository | Make it public intentionally or add collaborators before the lesson. |

## Close the lesson honestly

The demo proves product structure, interaction design, persistence, and responsive behavior. It is not yet a production multi-user service. A public paid product still needs authentication, a shared database, authorization rules, notification delivery, billing, privacy controls, moderation, analytics, observability, and coach operations.

That distinction is a useful final lesson: a convincing frontend MVP is evidence for a product direction, not evidence that the production system is complete.
