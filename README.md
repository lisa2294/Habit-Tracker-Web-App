# Habit

A focused habit-tracking web app for personal routines and small, private accountability groups. The product is designed as a working application—not a marketing site—and adapts from desktop workspaces to phone-sized screens.

> This repository currently contains a frontend-only MVP. Habits, check-ins, invitations, nudges, comments, and coach requests are stored in the current browser with `localStorage`. No email, payment, authentication, or real multi-user delivery is connected yet.

## Product areas

### Personal habits

- Create, edit, complete, archive, and restore habits.
- See today's completion score and current streaks.
- Review a monthly calendar and consistency insights.
- Export and restore a readable JSON backup.

### Accountability Circles

- Create and switch between private circles.
- Define a shared challenge and weekly target.
- Post structured check-ins: Complete, In progress, Blocked, or Skipped.
- Ask the group for support and respond with encouragement or comments.
- Invite members and send supportive, template-based nudges.
- Review each member's weekly participation without ranking people.
- Browse a prototype professional-coach directory and save a request locally.

The sample **Momentum Lab** circle is seeded so the complete experience is visible immediately.

## Run locally

```bash
git clone https://github.com/lisa2294/Habit-Tracker-Web-App.git
cd Habit-Tracker-Web-App
npm ci
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173/Habit-Tracker-Web-App/`. The configured production base path supports the existing GitHub Pages workflow.

## Quality checks

```bash
npm run lint
npm run build
```

## Tech stack

- React 19 and Vite 7
- Inter Variable typography
- Tailwind CSS build pipeline with a custom responsive CSS design system
- Browser `localStorage` for frontend persistence

## Documentation

- [Installation guide](INSTALLATION.md)
- [Student demo guide](docs/student-demo-guide.md)
- [Design system and product UI rules](design.md)
- [Accountability Circles PRD](docs/accountability-circles-prd.md)

## Project structure

```text
src/
├── components/
│   ├── CirclesView.jsx          # Circle overview, people, challenge, and coach flows
│   ├── AddHabitForm.jsx         # Habit creation
│   ├── HabitList.jsx            # Daily and archived habit lists
│   ├── CalendarView.jsx         # Monthly history
│   ├── StatisticsDashboard.jsx  # Personal insights
│   └── DataExport.jsx           # Backup, restore, and local reset
├── data/
│   └── circles.js               # Seed circle and prototype coach directory
├── hooks/
│   └── useLocalStorage.js       # Persistent frontend state
├── App.jsx                      # App shell and navigation
├── index.css                    # Responsive product design system
└── main.jsx                     # Application entry point
```

## Frontend MVP boundaries

The current invitation, nudge, comment, and coach-request flows prove the interaction design and persist on one device. A production release still needs accounts, a shared data service, authorization, transactional email, notification preferences, abuse controls, billing, and coach operations. Those requirements are detailed in the PRD.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
