# Habit Ledger — Visual Design Rules

## Design intent

Habit Ledger is a signed-in-feeling personal workspace for a daily habit practice. It should feel like an efficient application, not a product introduction: current work, status, and the next action remain visible while the user moves between views. The surface is calm, typographic, and deliberately flat. Progress is important information, so the UI uses a single highlighter-yellow signal only when an action is available, navigation is active, or a live completion metric changes.

The existing product capabilities remain in scope:

- Add, edit, delete, and complete habits.
- Show the daily progress tally and current streaks.
- Browse completion history in the calendar.
- Review statistics, rankings, and the recent activity chart.
- Export, import, and clear locally stored data.

## Foundations

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--color-highlighter-yellow` | `#e4f222` | Filled primary actions, active navigation, completed/live counters, and the current bar in a chart. This is the only chromatic accent. |
| `--color-ink` | `#0c0a08` | Primary text, borders for strong controls, chart bars. |
| `--color-obsidian` | `#1a1919` | Desktop sidebar and mobile app navigation. |
| `--color-paper` | `#ffffff` | Cards, form fields, status strip, and sticky header. |
| `--color-bone` | `#f4f2f0` | Page canvas and quiet surfaces. |
| `--color-ash` | `#6d6c6b` | Supporting copy, dates, labels, and captions. |
| `--color-hairline` | `#e5e7eb` | One-pixel structural borders and dividers. |
| `--color-smoke` | `#d3d3d3` | Inactive calendar/status markers. |

Do not introduce blue, green, red, purple, gradients, or decorative color coding. Completion, warning, and deletion states must communicate through wording, shape, borders, and the single accent—not a second color system.

### Typography

- Use `Lausanne` when installed; otherwise use `Inter`, `IBM Plex Sans`, then the system sans-serif stack.
- Use only a 400 weight. Establish hierarchy with scale, line-height, case, and tracking instead of boldness.
- Enable `font-feature-settings: "ss01"` globally.
- A view has one page title at 32–40px / 1.0. Do not add display-style headings inside panels.
- Eyebrows, navigation labels, legends, status labels, and metric captions use 10px uppercase text with `0.05em` tracking and generous line-height.
- Panel labels, helper copy, and card names use body/subheading scale rather than additional heading levels.
- Keep page titles and body copy left aligned. Numbers can align right inside metric blocks where comparison benefits from it.

### Space, shape, and elevation

- Use a 4px base rhythm: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, and 128px.
- On desktop, reserve a 248px dark navigation rail and constrain workspace content to about 1244px. On smaller screens, convert that rail into a sticky horizontal app nav.
- Use 16–20px padding inside working cards and 8–16px gaps inside small control groups. Major workspace spacing is 24–36px, not landing-page scale.
- Radii are fixed: 6px buttons/tags, 10px inputs, 12px quiet wash panels, and 16px content cards. Do not use pill shapes or arbitrary radii.
- Elevation comes from a `1px` hairline border and a surface change—never from a drop shadow. The sticky header may use only a faint white inset highlight.

## Layout rules

1. The application shell owns navigation. Use a sticky Obsidian sidebar with a compact profile block on desktop; switch it to a sticky horizontal nav on smaller screens.
2. A slim top bar shows the current date and workspace/account state.
3. Directly below the top bar, keep a sticky status strip visible with exactly three user-facing facts: current work, current status, and next action. Its action button takes the user back to their habit list or input.
4. Each view has one page title only: `Today`, `Calendar`, `Insights`, or `Data`. The title describes the current task; panel content uses labels and helper text, not additional page headings.
5. Working content starts immediately after the page header. Use concise cards, clear form labels, and a compact vertical rhythm rather than a hero, ticker, or campaign-style section.
6. Keep desktop content left aligned in the workspace. Do not center text merely for decoration.

## Component rules

### Buttons and controls

- **Primary button:** highlighter-yellow fill, ink text, 6px radius, approximately 44px tall. Use for “Add habit” and the single most prominent action in a group.
- **Outlined button:** paper fill, 1px ink border, ink text, 6px radius. Use for navigation controls, import, save, and destructive actions when context makes their purpose explicit.
- **Quiet button:** transparent with no border. On hover, use a Bone fill. Use for edit/delete and secondary actions.
- **Icon button:** 40px square, hairline bordered or Bone surface, 10px radius. Always include an accessible label.
- All controls use color/background/border transitions of 200–400ms; no scale, bounce, or glow effects.

### Application shell and status

- Navigation labels should be plain-language task destinations: Today, Calendar, Insights, and Data. Include a small index only as a supporting orientation cue.
- The active destination uses the highlighter-yellow fill. Inactive navigation stays Obsidian/Paper with no competing accent.
- The status strip is a working control, not a marketing metric: show `Current work`, `Status`, and `Next action` in that order, plus one direct action button.
- Use a compact local-profile treatment to make the workspace feel personal without inventing an authentication flow or hiding local-first behavior.
- The user must be able to return to their current habit list or input from every view in one action.

### Forms

- Inputs are white, 1px hairline-bordered, 10px radius, and use 16px body text.
- Labels use the uppercase caption treatment. Supporting text is Ash.
- On focus, swap the border to Ink and add an unobtrusive 2px Bone outline. Do not use colored focus rings.

### Habit cards

- Present each habit in a white 16px-radius card with a hairline border, not a shadow.
- The completion trigger is a compact square control, not a circular badge. A completed card may use the highlighter fill on the control and a highlighter edge/inset to state completion.
- Streaks, milestones, and descriptions remain ink/ash text. Avoid multicolored achievement badges.
- Edit mode uses the same fields and buttons as creation mode so it reads as an inline desk edit.

### Progress, calendar, and analytics

- Progress uses a Bone track and one highlighter-yellow bar. The percentage is a large editorial number, not a colorful gauge.
- Calendar days use hairline/smoke structural cues. Full days use a highlighter square, partial days use Ink, and empty days use Smoke. The current date uses an Ink border.
- Metric cards use typography and borders for contrast. At most one live metric may use a highlighter surface.
- Charts are monochrome Ink bars with the current day highlighted in yellow.

### Data management

- Treat export as the primary data action, import as outlined, and clear as quiet/outlined. Do not use red as a destructive shortcut.
- Surface import/export results as concise inline status text, rather than decorative alerts when possible.

### Accountability Sprint

- Place `Sprint` ahead of daily habits in app navigation. It is a working space for a fixed four-week commitment, not a marketing landing page.
- Before a sprint exists, use one concise setup card: goal, coach name, start date, and up to three Week 1 commitments with a definition of done.
- Once active, keep the sprint goal, week number, date range, coach name, and check-in record visible in compact cards.
- A daily check-in uses three textual states only—Complete, Partial, Blocked—plus optional commitment selection and a short note. Do not add celebratory animation or multi-color status badges.
- Participant and coach views share the same record. The role switch is a compact segmented control; the coach view prioritizes today’s status, review state, a concise weekly review form, and recent check-ins.
- Coach feedback is a plain white or Bone card with one explicit “Next week” instruction. It should read as useful guidance, not social feed content.
- Include sprint data in local backups alongside habits and completion history.

## Responsive behavior

- **Desktop (≥ 821px):** show the sticky left app rail, sticky date header, and sticky current-work strip. Keep the habit form in two fields plus one action; metrics can sit in up to four columns.
- **Tablet (621–820px):** turn the sidebar into a horizontal sticky app nav. Keep the current-work strip beneath it and allow the form to use two fields before stacking its action.
- **Mobile (≤ 620px):** retain sticky navigation and the current-work strip, but stack its next action below current work/status. Use 16px workspace gutters; stack form fields, cards, data actions, and metrics. Calendar cells remain seven columns with reduced padding.
- Preserve minimum 40–44px target sizes for controls and keep keyboard focus visible at every breakpoint.

## Do

- Let typography, whitespace, and hairline structure carry the visual hierarchy.
- Reserve highlighter yellow for action, active state, and live progress.
- Use concise uppercase micro-labels to establish the editorial voice.
- Keep current work, status, and next action available while the user is in any view.
- Use exactly one page title per active view; use labels and supporting copy inside cards.
- Treat a coach review and a participant check-in as small, focused forms—not as chat, posts, or a public community surface.
- Prefer flat white cards on the warm Bone canvas.
- Use motion only to clarify a value, focus, hover, or selection change.
- Keep semantics intact: buttons remain buttons, inputs retain labels, and live status has accessible text.

## Do not

- Do not use gradients, colorful status systems, shadows, glow effects, or bouncy/scaling hover animation.
- Do not add a second accent color, stock imagery, decorative illustrations, or large emoji as primary UI decoration.
- Do not use bold/semibold type to create hierarchy.
- Do not use a hero section, promotional slogan, live ticker, campaign metric, or repeated page heading inside the application.
- Do not center page titles or paragraphs.
- Do not imply real coach matching, payments, or account identity in a local-only prototype; keep those future capabilities visibly out of the MVP interaction model.
- Do not use pill controls, fully round completion badges, or radii outside 6/10/12/16px.
- Do not remove, disguise, or make inaccessible existing habit, calendar, statistics, export, import, or clear-data functionality during the redesign.
