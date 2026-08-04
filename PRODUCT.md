# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** Teachers and educators running live quizzes in classrooms. They create quiz content, launch game sessions, and monitor participation in real time from a projected screen or teacher device.
- **Secondary:** Students/participants joining on personal devices (phones, tablets, laptops) via QR code or room code. They answer questions under time pressure and compete on a live leaderboard.

## Product Purpose

SBG Quiz is a real-time quiz competition platform for education. It makes classroom quizzes engaging by turning them into live competitive events — the teacher projects questions and a leaderboard while students race to answer on their own devices. Success means students are actively participating and engaged, and teachers can run a quiz session with zero friction.

## Positioning

An open-source Kahoot alternative that runs on your own infrastructure. The mechanism is the live competition loop: teacher creates quiz → launches game → students join via QR → timed questions → live scoring → animated podium results. The meaningful difference is self-hosted control and open-source transparency for schools that care about data ownership.

## Operating Context

- **Physical classroom:** Teacher projects the host screen (lobby, questions, leaderboard, results) onto a whiteboard/projector. Students sit at desks with phones.
- **Join flow:** Students scan a QR code displayed on the projected screen, or type a 6-character room code. They enter a nickname and join a lobby.
- **Game loop:** Teacher advances through phases (lobby → quiz → results). Questions appear with a 20-second countdown. Students tap one of four colored answer buttons. Scores are time-weighted (faster = more points, max 1000). A live leaderboard updates between questions.
- **Results:** Animated podium (1st/2nd/3rd) with confetti, followed by a runners-up table.
- **Content management:** Admins create "quiz sets" containing questions with 4 choices each. Quiz sets are reusable across games.
- **Authentication:** Simple email/password login for admins (JWT-based).
- **Technical polling:** Client polls every ~1.5s for game state changes (no WebSockets).

## Capabilities and Constraints

- Quiz set CRUD (create, read, update, delete questions and choices)
- Game creation, state management (lobby/quiz/result phases)
- Real-time participant join with room code validation
- Time-weighted scoring system (faster answers earn more)
- Live leaderboard computation
- Animated results podium with confetti
- QR code generation for mobile join
- Game history with participant lists
- Responsive: host dashboard (desktop-first), player views (mobile-first)
- Prisma ORM with PostgreSQL (Supabase local dev)
- Next.js 14 App Router, TypeScript, Tailwind CSS
- No WebSocket support — relies on polling
- No image upload for questions (imageUrl field exists but no upload flow)

## Brand Commitments

- **Name:** SBG Quiz
- **Voice:** Energetic, encouraging, playful — speaks to both teachers and students
- **Identity:** Complete redesign from current dark-purple generic AI template. Bold, playful, classroom-appropriate.

## Evidence on Hand

- Full working codebase with all CRUD, game flow, and scoring logic
- Prisma schema with 6 models (Admin, QuizSet, Question, Choice, Game, Participant, Answer)
- Seed data with 7 quiz sets and questions
- No DESIGN.md exists
- No existing brand assets (logo, colors, typography are generic)

## Product Principles

1. **Zero-friction classroom use:** A teacher should be able to go from login to a live game in under 2 minutes. Students should join in under 30 seconds.
2. **Engagement through competition:** The design should amplify the excitement of real-time competition — urgency, scoring, leaderboard movement, and celebration.
3. **Self-hosted simplicity:** The product should feel complete and polished without requiring external services, SaaS accounts, or complex deployment.
4. **Open and transparent:** As an open-source tool for education, it should feel trustworthy and honest — no hidden data collection, no dark patterns.

## Accessibility & Inclusion

- Keyboard navigation for host dashboard
- Focus indicators on interactive elements
- Color contrast on dark backgrounds
- Answer choices use color + shape (▲◆●■) for color-blind accessibility
- No screen reader testing documented
