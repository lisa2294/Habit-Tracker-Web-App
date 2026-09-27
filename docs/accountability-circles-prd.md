# Product Requirements Document: Accountability Circles

| Field | Value |
| --- | --- |
| Status | Draft for review |
| Version | 0.1 |
| Last updated | September 27, 2026 |
| Product | Habit |
| Release | Private beta |
| Primary audience | Working professionals |

## 1. Executive summary

Accountability Circles turns Habit from a private checklist into a trusted, small-group accountability product for working professionals. Users create or join invite-only circles, commit to shared challenges, complete structured check-ins, send supportive nudges, and optionally hire a professional coach.

The product should feel closer to a focused operating ritual than a social network. It must be private by default, quick to use, respectful of work schedules, and explicit about what information is shared.

The first release will support circles of 2–12 members, one or more shared challenges, daily or weekly check-ins, a lightweight activity feed, consent-based nudges, in-app and email notifications, circle roles, and a curated coaching pilot. An open coach marketplace, real-time chat, video calls, and employer performance monitoring are out of scope for the first release.

## 2. Product decision summary

- **Core promise:** Make important habits harder to quietly abandon by adding trusted people, visible commitments, and timely support.
- **Primary user:** A working professional participating in a peer or coach-led circle.
- **Primary buyer:** The circle organizer, who pays so invitees can participate without purchase friction.
- **Premium expansion:** Optional professional coaching for a circle or individual member.
- **MVP circle size:** 2–12 members; 4–8 is the recommended range.
- **MVP communication model:** Structured check-ins, comments, nudges, and weekly reviews—not unrestricted group chat.
- **Coach launch model:** Curated concierge matching with a limited coach roster; marketplace discovery and automated payouts follow after validation.
- **Pricing hypothesis:** $12/month individual Pro, $49/month Circle plan for up to eight members, and coaching packages starting around $99/month.

Pricing is a hypothesis to test. Current market signals include Focusmate charging $8/month annually or $12 monthly for unlimited accountability sessions, and Coach.me listing habit coaching at $25/week or $87/month, with leadership coaching at $150/month.

## 3. Current product context

Habit currently provides personal habit creation, daily completion, streaks, calendar history, insights, and local data export. Data lives only in browser `localStorage`; the app has no accounts, shared backend, notification service, or billing system.

Accountability Circles therefore requires foundational platform work:

1. User accounts and authentication.
2. A server-side source of truth for habits, completions, circles, and memberships.
3. Authorization rules that protect private habits and circle data.
4. Email and in-app notifications.
5. Subscription billing.
6. A migration path that imports existing local habits into a private user account.

Personal habit tracking must continue to work independently. Joining a circle must never make all of a user’s habits visible automatically.

## 4. Problem

Working professionals often know which behaviors matter but struggle to maintain them through changing schedules, deadlines, travel, and low-energy periods. Traditional habit trackers record activity but create little consequence or support when a habit slips. General-purpose group chats create noise, make progress hard to scan, and blur personal and professional boundaries. One-to-one coaching can solve this problem, but it is expensive and difficult to evaluate before purchase.

Users need a private place where a small number of trusted people can:

- make a specific commitment;
- see whether the group is on track;
- check in without writing a long update;
- ask for help when blocked;
- provide encouragement without creating notification pressure; and
- bring in a professional coach when peer accountability is not enough.

## 5. Target users

### 5.1 Circle member

A working professional who wants external accountability for a specific routine or outcome. Examples include managers, individual contributors, founders, freelancers, and remote workers.

**Needs:** Fast check-ins, psychological safety, control over shared data, helpful reminders, and progress that survives an imperfect week.

### 5.2 Circle organizer

A member who creates the circle and is responsible for its purpose, membership, and challenge settings.

**Needs:** Easy invitations, clear participation status, lightweight facilitation tools, and billing that does not force every invitee to pay before experiencing value.

### 5.3 Professional coach

A vetted coach supporting one person or a circle through asynchronous feedback, weekly reviews, and optional external sessions.

**Needs:** A concise client dashboard, permissioned access, structured client signals, boundaries around availability, and reliable payment.

### 5.4 Explicitly excluded primary user

Employers or managers evaluating employee performance. The MVP is not an employee surveillance, attendance, or productivity-scoring product. A future team offering would require separate consent, privacy, and administrative design.

## 6. Jobs to be done

- **When I commit to a meaningful habit,** help me make that commitment visible to people I trust so I am more likely to follow through.
- **When my schedule disrupts my routine,** let me report a blocker and recover without losing the group’s support.
- **When another member is slipping,** help me send a timely and respectful nudge without becoming their manager.
- **When peer support is insufficient,** help me add a qualified coach who can see the right context and guide the next step.
- **When I organize a circle,** show me participation and risks without exposing private habits or requiring manual spreadsheets.

## 7. Goals and non-goals

### Goals

1. A new user can create a circle, define a challenge, and send invitations in under three minutes.
2. A member can complete a check-in in under 30 seconds.
3. Members always understand who can see each piece of information.
4. Circles create a repeatable weekly ritual, not a high-volume social feed.
5. The product supports a paid organizer plan and a paid coaching add-on.
6. The initial coach workflow can be operated with a small, curated roster.

### Non-goals for MVP

- Public profiles, public groups, follower counts, or discovery feeds.
- Unrestricted real-time chat or direct messaging between all users.
- Native audio or video calls.
- Employer dashboards, employee rankings, or performance exports.
- AI-generated coaching presented as professional advice.
- Medical, mental-health, nutrition, or therapeutic treatment.
- A fully open coach marketplace with self-service payouts.
- Team competitions, leaderboards, points, badges, or punitive streak mechanics.

## 8. Product principles

1. **Private by default.** Personal habits remain private until the user explicitly links them to a challenge.
2. **Consent before visibility.** Every shared field states its audience before submission.
3. **Small groups over audiences.** Circles are designed for trust, not reach.
4. **Structure over noise.** Use check-ins, prompts, and reviews instead of an endless chat stream.
5. **Support over shame.** Misses are surfaced as recovery opportunities, not public failure badges.
6. **Respect professional boundaries.** Quiet hours, time zones, and notification controls are first-class.
7. **Human coaching is clearly labeled.** Verified qualifications, availability, pricing, and response expectations are visible before purchase.

## 9. MVP scope

### 9.1 Accounts and onboarding

- Sign up and sign in with email magic link; add Google or Microsoft sign-in after the private beta if needed.
- Collect display name, time zone, work schedule preference, and notification settings.
- On first sign-in, offer to import the device’s local habits and completions into the new private account.
- Explain that imported habits remain private.
- Let invite recipients preview the circle name, purpose, organizer, member count, challenge summary, and price responsibility before creating an account.

### 9.2 Private circles

- Create a circle with name, purpose, optional cover color, time zone, duration, and default check-in schedule.
- Invite members by email or expiring invite link.
- Links expire after seven days and can be revoked by the owner.
- Circle size is limited to 12 in MVP.
- Roles are Owner, Member, and Coach.
- Owners can approve pending members, remove members, transfer ownership, archive a circle, and configure whether member-to-member nudges are enabled.
- Members can leave at any time and choose whether their historical check-ins remain attributed or are anonymized, subject to billing and legal retention requirements.

### 9.3 Shared challenges

- Owners create challenges with:
  - title and concise outcome;
  - start and end date;
  - daily or weekly cadence;
  - target count;
  - check-in window;
  - visibility statement;
  - optional prompt; and
  - success definition.
- Suggested templates for beta: Deep Work Sprint, Morning Planning, Movement After Work, Learning Practice, and Digital Shutdown.
- Members explicitly join a challenge.
- A member can link an existing personal habit or create a new habit for the challenge.
- The circle sees challenge check-in results, not unrelated personal habit data.
- MVP uses a common target for all participants. Personalized targets are deferred.

### 9.4 Check-ins

- A check-in records one status: Complete, Partial, Skipped, or Blocked.
- Optional fields:
  - short note up to 280 characters;
  - blocker category;
  - “I want support” toggle; and
  - completion quantity when the challenge uses a numeric target.
- No image or file evidence in MVP.
- Members may edit a check-in until the check-in window closes.
- Late check-ins are labeled late rather than rejected.
- The interface shows the audience before submission: “Visible to 6 circle members and your coach.”
- Check-ins appear in a chronological activity feed and a weekly member grid.

### 9.5 Circle overview

The default circle view shows:

- active challenge and remaining duration;
- today’s or this week’s check-in status;
- member participation grid;
- members requesting support;
- recent check-ins and comments;
- next scheduled review; and
- coach status when a coach is attached.

The overview must not rank members. It may show completion totals and participation rates, but must avoid “best” and “worst” labels.

### 9.6 Comments and reactions

- Members can comment on a check-in using text up to 500 characters.
- MVP reactions are limited to a small supportive set such as Acknowledge, Encourage, and Celebrate.
- Comments inherit the visibility of the check-in.
- Members can edit or delete their own comments.
- Owners can remove content and remove a member.
- Users can report content or block another user.

### 9.7 Nudges

- Nudges are private, lightweight notifications tied to a challenge or overdue check-in.
- Users choose a supportive template and may add up to 100 characters.
- Sender identity is always visible.
- A recipient may receive no more than two member-generated nudges in 24 hours.
- Recipients can mute one person, mute a circle, or disable member nudges entirely.
- Quiet hours and recipient time zone are respected.
- Coaches and owners are subject to separate configurable rate limits, with no bypass of a recipient’s mute preference.
- Nudge delivery is recorded for audit and abuse review; nudge content is not shown publicly in the circle feed.

### 9.8 Notifications

- In-app notification center.
- Email for invitations, daily or weekly check-in reminders, support requests, coach replies, and billing events.
- Each event type can be disabled independently, except essential security and billing messages.
- Daily reminders are bundled when multiple challenges are due.
- Default quiet hours are 8:00 p.m.–8:00 a.m. in the recipient’s time zone.
- Browser and mobile push notifications are post-MVP.

### 9.9 Professional coaching

The private beta uses a curated coach program rather than an open marketplace.

#### Member and circle experience

- View a small coach directory with specialty, biography, verified-status label, languages, time zone, package, response cadence, and price.
- Request a coach for an individual or a circle.
- Complete an intake form covering goals, constraints, preferred coaching style, and data-sharing consent.
- Purchase a monthly coaching package.
- See the coach’s expected response time and next review date.
- Cancel renewal and remove coach access.

#### Coach experience

- Accept or decline a matched engagement.
- View only the circles, challenges, check-ins, and profile details covered by the engagement.
- Comment on check-ins, send coaching nudges, post a weekly review, and share an external scheduling link.
- Mark availability and pause new matches.
- See active engagements and package status.
- Lose access immediately when an engagement ends, except for legally required transaction records.

#### Operational model

- The beta team reviews and approves every coach profile.
- “Verified” appears only for qualifications the platform has actually checked.
- Matching may be completed manually by operations during beta.
- Coach payouts may be handled manually during the pilot; automated marketplace payouts require a later Stripe Connect integration and associated identity verification.

## 10. Roles and permissions

| Capability | Owner | Member | Coach |
| --- | --- | --- | --- |
| View joined circle | Yes | Yes | Engagement only |
| Invite members | Yes | No | No |
| Remove members | Yes | No | No |
| Create or edit challenge | Yes | No | Recommend only |
| Join challenge | Yes | Yes | No |
| Submit own check-in | Yes | Yes | No |
| View shared check-ins | Yes | Yes | Engagement only |
| View unrelated personal habits | No | No | No |
| Comment on shared check-ins | Yes | Yes | Engagement only |
| Send nudges | Configurable | Configurable | Engagement only |
| Post weekly review | No | No | Yes |
| Manage circle billing | Yes | No | No |
| Manage coaching engagement | Yes | Individual purchase only | Accept/decline |
| Archive circle | Yes | No | No |

## 11. Functional requirements

| ID | Requirement | Priority | Acceptance criteria |
| --- | --- | --- | --- |
| AC-001 | Authenticated accounts | P0 | A user can sign up, sign in, sign out, and recover access without losing server data. |
| AC-002 | Local data migration | P0 | On first sign-in, a user can import local habits once; import is idempotent and private. |
| AC-003 | Create private circle | P0 | A valid owner can create a circle and becomes its sole initial member. |
| AC-004 | Invite flow | P0 | Email and expiring-link invitations can be accepted once, revoked, and audited. |
| AC-005 | Membership authorization | P0 | Non-members cannot read circle metadata beyond the invitation preview. |
| AC-006 | Role enforcement | P0 | Every protected action is rejected server-side when the role lacks permission. |
| AC-007 | Shared challenge | P0 | Owners can create, edit before start, start, complete, and archive a challenge. |
| AC-008 | Explicit challenge opt-in | P0 | Joining a circle does not automatically enroll a member in every challenge. |
| AC-009 | Habit visibility | P0 | A habit is private unless its owner explicitly links it to a challenge. |
| AC-010 | Structured check-in | P0 | A participant can submit one status per window and edit it until close. |
| AC-011 | Circle overview | P0 | Members see current challenge status, participation, support requests, and activity. |
| AC-012 | Comments and reactions | P0 | Authorized users can respond to visible check-ins; deleted content is removed from the UI and retained only per policy. |
| AC-013 | Nudge controls | P0 | Rate limits, quiet hours, mute settings, sender identity, and audit records are enforced. |
| AC-014 | Email notifications | P0 | Invitations and scheduled reminders are delivered with unsubscribe controls where applicable. |
| AC-015 | In-app notifications | P0 | Users can view, mark read, and navigate from notification to source. |
| AC-016 | Circle billing | P0 | Owner can start, view, update, and cancel the Circle subscription. |
| AC-017 | Coach profile | P1 | Approved coaches have a public-to-members profile with price, scope, and verification labels. |
| AC-018 | Coach request and intake | P1 | A member or owner can request a coach and grant explicit data access. |
| AC-019 | Coaching engagement | P1 | Access begins after acceptance/payment and ends immediately on cancellation or expiration. |
| AC-020 | Weekly coach review | P1 | Coach can publish one structured review visible to the engagement audience. |
| AC-021 | Report and block | P0 | Users can report content/users and block further direct nudges or comments. |
| AC-022 | Data export and deletion | P0 | User can export personal/circle data they are authorized to access and request account deletion. |
| AC-023 | Audit log | P0 | Membership, role, visibility, moderation, and coach-access changes are recorded. |
| AC-024 | Responsive access | P0 | All member flows work without horizontal scrolling at 320px and with keyboard navigation on desktop. |

## 12. Information architecture

Add a fifth primary navigation item: **Circles**.

### Circles index

- Your circles
- Pending invitations
- Create circle
- Coaching engagements

### Circle detail

- **Overview:** active challenge, check-in action, participation grid, support requests, recent activity.
- **Challenges:** active, upcoming, and archived challenges.
- **People:** members, roles, invitations, notification state.
- **Coach:** current coach, weekly reviews, package, request or remove coach.
- **Settings:** circle purpose, nudge rules, time zone, billing, archive/leave.

### Global supporting surfaces

- Notification center
- Profile and privacy settings
- Billing settings
- Coach directory and coach profile
- Report/block dialogs

## 13. Core user flows

### 13.1 Create and activate a circle

1. User selects Circles → Create circle.
2. User enters name, purpose, duration, time zone, and nudge policy.
3. User selects a challenge template or creates one.
4. User invites at least two people.
5. Invitee previews and accepts the invitation.
6. Invitee explicitly joins the challenge and chooses or creates a linked habit.
7. Circle becomes “Active” after at least two members join the challenge.

### 13.2 Complete a check-in

1. Member opens Today or a reminder deep link.
2. Shared habit is labeled with its circle and audience.
3. Member selects Complete, Partial, Skipped, or Blocked.
4. Member optionally adds a note or requests support.
5. Confirmation shows what was shared and provides an Undo action.
6. Circle overview updates without a full page reload.

### 13.3 Send a nudge

1. Member selects an eligible circle member.
2. Product shows recipient time zone, quiet-hour status, and remaining nudge allowance.
3. Sender selects a template and optionally adds a short note.
4. Product previews the message and identifies the sender.
5. Nudge is delivered immediately or queued until quiet hours end.
6. Recipient can respond, mute the sender, or change nudge settings.

### 13.4 Add a coach

1. Owner or member opens Coach and reviews curated profiles.
2. Purchaser selects circle or individual coaching and a package.
3. Purchaser completes intake and approves the exact shared data scope.
4. Coach accepts the request.
5. Billing begins and access is granted.
6. Coach posts the first review within the promised response window.
7. Purchaser can cancel renewal; access ends at the defined package boundary or immediately when removed for cause.

## 14. Data model

| Entity | Key fields |
| --- | --- |
| User | id, email, displayName, timeZone, locale, notificationPreferences, createdAt |
| Circle | id, ownerId, name, purpose, timeZone, maxMembers, nudgePolicy, status, createdAt |
| Membership | id, circleId, userId, role, status, joinedAt, mutedAt |
| Invitation | id, circleId, inviterId, email, tokenHash, expiresAt, acceptedAt, revokedAt |
| Habit | id, userId, name, description, cadence, status, createdAt |
| Completion | id, habitId, userId, occurredOn, quantity, source, createdAt |
| Challenge | id, circleId, title, outcome, cadence, target, startAt, endAt, checkInWindow, status |
| ChallengeParticipant | id, challengeId, userId, habitId, joinedAt, visibilityConsentVersion |
| CheckIn | id, challengeId, participantId, windowKey, status, quantity, note, supportRequested, submittedAt, editedAt |
| Comment | id, checkInId, authorId, body, createdAt, deletedAt |
| Nudge | id, circleId, challengeId, senderId, recipientId, templateId, body, deliveryStatus, deliverAt, createdAt |
| Notification | id, userId, type, sourceId, channel, readAt, deliveryStatus, createdAt |
| CoachProfile | id, userId, bio, specialties, languages, timeZones, verificationClaims, packages, availabilityStatus |
| CoachingEngagement | id, coachId, purchaserId, circleId, memberId, packageId, dataScope, status, startsAt, endsAt |
| Subscription | id, payerId, circleId, providerCustomerId, providerSubscriptionId, plan, status, renewalAt |
| AuditEvent | id, actorId, circleId, action, targetType, targetId, metadata, createdAt |

### Data rules

- Store canonical dates in UTC and retain each user’s IANA time zone for check-in windows.
- Enforce authorization at the API/database layer, not only in React.
- A challenge participant references one shared habit, but the circle receives only challenge-scoped completions and check-ins.
- Editing a visibility setting never retroactively shares old private habit data without explicit confirmation.
- Server-side IDs must be non-sequential and invitation tokens must be stored as hashes.

## 15. Monetization and packaging hypothesis

### Free

- Personal habit tracking.
- Join one circle.
- Participate in one active shared challenge.
- Core check-ins and limited nudges.

### Pro — proposed $12/month or $96/year

- Create one circle with up to four members.
- Join up to three circles.
- Unlimited personal and shared challenges.
- Advanced reminders, circle insights, and data export.

### Circle — proposed $49/month

- Organizer pays for up to eight members; invitees can participate without a paid plan.
- Up to three simultaneous challenges.
- Circle-level insights, scheduled weekly digest, and priority support.
- Additional members as a paid add-on, up to the 12-person product limit.

### Coaching add-on — proposed $99–$249/month

- Coach-defined package with explicit response cadence and scope.
- Platform fee hypothesis: 15–20% after the curated beta proves demand and unit economics.
- During the beta, test one standardized package before allowing fully custom pricing.

### Pricing experiment

Run a willingness-to-pay test with three organizer offers: $29, $49, and $79 per circle per month. Measure checkout intent before discounting. The Circle plan should be the primary offer because owner-paid access reduces invitation friction.

## 16. Success metrics

### North-star metric

**Weekly accountable check-ins:** completed check-ins in active circles where at least one other member viewed, reacted, commented, or sent support during the same week.

This measures follow-through plus actual accountability rather than passive membership.

### Activation

- 60% of created circles reach two accepted members and one active challenge within 72 hours.
- 70% of accepted members complete their first check-in within the first challenge window.
- Median time from Create circle to invitations sent is under three minutes.

### Engagement and retention

- At least 65% weekly check-in completion across active participants.
- At least 50% of active circles have a meaningful member interaction each week.
- Four-week circle retention of at least 40% during beta.
- Fewer than 20% of nudges are muted or dismissed as unwanted.

### Revenue

- At least 8% of activated organizers start a paid trial or subscription.
- At least 5% of paid circles request coaching during the curated pilot.
- At least 40% of completed first-month coaching engagements renew once.

### Guardrails

- Report rate below 1% of active members per month.
- Nudge block rate below 2% of delivered nudges.
- Zero unauthorized cross-circle or personal-habit data exposures.
- Coach first-response SLA met in at least 95% of paid engagements.

All targets are beta hypotheses and should be revised after the first 20–50 activated circles.

## 17. Analytics events

- `circle_create_started`
- `circle_created`
- `circle_invite_sent`
- `circle_invite_viewed`
- `circle_invite_accepted`
- `challenge_created`
- `challenge_joined`
- `checkin_started`
- `checkin_submitted`
- `support_requested`
- `checkin_interaction_created`
- `nudge_composed`
- `nudge_queued_quiet_hours`
- `nudge_delivered`
- `nudge_muted`
- `coach_profile_viewed`
- `coach_request_submitted`
- `coach_engagement_started`
- `coach_review_published`
- `subscription_checkout_started`
- `subscription_started`
- `subscription_cancelled`
- `content_reported`

Analytics must not include check-in notes, nudge body text, private habit names, or other user-generated content.

## 18. Trust, privacy, and safety

- Show audience labels anywhere information is created or edited.
- Require explicit consent before linking a personal habit to a circle or coach.
- Provide report, block, mute, remove-member, and revoke-invite controls.
- Rate-limit invitations, comments, and nudges.
- Encrypt data in transit and at rest using the selected infrastructure provider.
- Maintain audit logs for role, membership, visibility, moderation, and coach-access changes.
- Do not sell habit, check-in, or coaching data.
- Let users export their data and request deletion.
- Remove coach access when an engagement ends.
- Do not claim that circle confidentiality prevents screenshots or off-platform sharing; state this limitation clearly.
- Position coaching as goal and accountability support, not therapy, medical care, or emergency assistance.
- Obtain legal review before launch for privacy terms, coaching disclaimers, refunds, coach classification, data retention, and marketplace payouts.

## 19. Accessibility and responsive requirements

- All core flows meet WCAG 2.2 AA interaction and contrast expectations.
- Every status has text in addition to color.
- Check-ins, invitations, comments, nudges, and billing are fully keyboard accessible.
- Live updates use non-disruptive ARIA announcements.
- At 320–640px, circle navigation becomes a horizontally safe segmented control or menu without document-level horizontal scrolling.
- Member grids transform into stacked member rows on small screens.
- Nudges and check-ins use bottom sheets or full-screen dialogs on mobile, not narrow desktop modals.
- Dates and reminder times display in the recipient’s local time zone.

## 20. Technical dependencies

The PRD is vendor-neutral, but implementation requires:

- managed authentication;
- relational database with row-level authorization or an equivalent server policy layer;
- server functions/API for invitations, notifications, billing webhooks, and authorization;
- transactional email provider;
- scheduled job system for reminders and weekly digests;
- subscription billing provider;
- object storage only if future releases add attachments; and
- marketplace payout provider when coach payouts become automated.

Stripe Billing is suitable for subscriptions. Stripe Connect is a candidate for later coach onboarding and payouts because it supports connected-account onboarding, identity checks, marketplace payments, and platform fees. The coach marketplace must not be treated as a simple subscription feature: payout, identity, tax, refund, and dispute operations need dedicated design.

## 21. Rollout plan

### Phase 0 — Account foundation

- Authentication and profiles.
- Server-side habit/completion storage.
- Local data migration.
- Privacy and authorization tests.

### Phase 1 — Core circles private beta

- Private circles, invitations, roles, challenges, check-ins, overview, comments, reactions, and reporting.
- In-app notification center.
- Operate with 10–20 invite-only circles.

### Phase 2 — Accountability and monetization

- Email reminders, quiet hours, nudges, weekly digest, subscriptions, and paywall behavior.
- Test organizer pricing and invitation conversion.

### Phase 3 — Curated coaching pilot

- Coach profiles, intake, manual matching, permissioned coach dashboard, weekly reviews, and one standardized package.
- Recruit 3–5 coaches and cap pilot capacity.

### Phase 4 — Marketplace validation

- Coach availability, package variation, ratings based on completed engagements, automated onboarding, payouts, refunds, and platform fees.
- Proceed only after demonstrating repeat coaching demand and safe operations.

## 22. Release criteria

The private beta can launch when:

1. A new user can import local data without exposing it to a circle.
2. Create, invite, accept, join challenge, check in, comment, nudge, mute, leave, and archive flows pass end-to-end tests.
3. Authorization tests prove that non-members, removed members, expired coaches, and users in other circles cannot access protected data.
4. Notification preferences, quiet hours, unsubscribe controls, and nudge rate limits work.
5. Circle subscriptions can start, renew, fail, recover, and cancel correctly.
6. Data export, account deletion, report, block, and audit flows are operational.
7. Mobile layouts work at 320px and desktop layouts work at 1440px.
8. Privacy policy, terms, community guidelines, coaching disclaimer, and refund policy have completed legal review.

The coaching pilot can launch when coach vetting, matching, access expiration, support escalation, package fulfillment, cancellation, and payout operations have named owners and tested procedures.

## 23. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Empty or inactive circles | Low value and churn | Templates, activation checklist, scheduled first check-in, organizer digest. |
| Invitations create payment friction | Lower invite acceptance | Organizer-paid Circle plan; free participation for invitees. |
| Nudges feel intrusive | Muting and churn | Consent, quiet hours, visible sender, templates, limits, block/mute. |
| Public shame dynamics | Reduced trust | No leaderboards, supportive language, recovery states, private-by-default data. |
| Coach quality varies | Refunds and reputation loss | Curated roster, clear verification labels, standardized package, SLA monitoring. |
| Marketplace operations expand too early | Compliance and support burden | Manual curated pilot before automated payouts and open listings. |
| Private data leaks across circles | Severe trust failure | Server-side authorization, row-level policies, access tests, audit logs. |
| Employer use becomes surveillance | Brand and ethical risk | Exclude performance scoring and employer dashboards from MVP. |
| Time-zone mistakes | Missed check-ins and noisy reminders | Store UTC plus IANA time zone; test daylight-saving transitions. |

## 24. Open product questions

1. Should the initial launch focus on peer circles, paid mastermind groups, or coach-led cohorts?
2. Should Circle billing include eight members or use a lower base price plus per-seat pricing?
3. Which professional outcome should be the launch wedge: deep work, leadership habits, health routines, or career development?
4. Should members be able to join multiple active challenges in the same circle during beta?
5. When a member leaves, should prior check-ins remain attributed, become anonymous, or be removed after a retention period?
6. What objective criteria qualify a coach for a verified label?
7. Does the first coaching package include only asynchronous feedback, or one scheduled call per month?
8. Which countries will be supported for coach sales and payouts at launch?

## 25. Recommended launch decisions

To keep the private beta focused, use the following defaults unless research contradicts them:

- Launch wedge: four-week professional focus and routine sprints.
- Circle size: recommend 4–8, hard limit 12.
- One active challenge per circle during the first beta.
- Organizer-paid $49/month Circle plan with a 14-day trial.
- Free participation for invited members.
- No general chat; comments are attached to check-ins.
- Coaching package: $149/month for asynchronous weekday support, one structured weekly review, and one monthly external call.
- Curated coaches only; no public applications until operational quality is proven.

## 26. Research references

- [Focusmate pricing](https://www.focusmate.com/pricing/): free limited access, $8/month billed annually or $12/month billed monthly, plus a business offering. This supports an accountability subscription benchmark.
- [Coach.me coaching options](https://support.coach.me/article/108-coaching): free community support, habit coaching at $25/week or $87/month, custom group coaching, and leadership coaching at $150/month. This supports a meaningful willingness-to-pay hypothesis for human guidance.
- [Stripe Connect](https://stripe.com/connect): connected-account onboarding, identity verification, marketplace payments, platform fees, and payouts. This informs the post-pilot coach marketplace dependency.
