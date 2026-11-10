# Wellfitness

Wellfitness is a mobile-first fitness tracker for planning workouts, logging meals, and following progress over time. The React app talks to a Spring Boot API backed by MySQL. Email/password and Google sign-in use JWT authentication.

## AI features

| Feature | What it does | Where to find it |
| --- | --- | --- |
| **Personal AI Coach** | Answers questions using the user's fitness goal, current body metrics, recent meals, and completed workouts. It can request older diet, workout, exercise-set, and body-measurement records through bounded, read-only database tools. | **AI Coach** tab; [`features/ai`](backend/src/main/java/com/wellfitness/features/ai/) |
| **AI meal ideas** | Suggests meals using the selected day's diary, nutrition targets, fitness goal, and preferences entered for that request. Suggestions are not automatically saved as food logs. | **Diet** tab; [`features/diet`](backend/src/main/java/com/wellfitness/features/diet/) |
| **AI nutrition estimates** | Estimates calories and macros from a food name, serving, and optional ingredient notes. Users can edit the estimate before explicitly saving a meal. | **Diet -> Log food** |

The AI features use an Azure OpenAI deployment in Azure AI Foundry through the Responses API. The coach combines a small profile and recent-activity summary with on-demand database tools instead of sending months of raw logs in every prompt. Tool queries are scoped to the authenticated user and limited by date range and result size. AI requests use `store: false`; the coach's conversation remains in the current browser page session. Estimates and suggestions are approximate. If Azure is unavailable, manual meal logging still works.

**Azure setup:** copy [`backend/.env.example`](backend/.env.example) to `backend/.env` and set `AZURE_OPENAI_ENDPOINT` to your Azure OpenAI **resource** URL, `AZURE_OPENAI_DEPLOYMENT` to the deployment name, and `AZURE_OPENAI_API_KEY` to its key. Start the backend from `backend/` or the repository root so it can load this file. Restart after changing it. Keep keys out of Git and the frontend. See [`backend/DIET_AI_SETUP.md`](backend/DIET_AI_SETUP.md) for endpoint details and the AI API contracts.

## Other features

- Workout sessions with exercises, sets, reps, weights, history, and progress views.
- Workout splits and an exercise library.
- Daily diet diary with calorie and macro totals and editable nutrition targets.
- Onboarding and profile settings for goals, weight, and height. New or updated measurements are dated so the coach can discuss trends; older measurements cannot be reconstructed.
- Responsive desktop navigation and mobile bottom navigation.

## Project layout

```text
frontend/     React 19, Vite, React Router, Tailwind CSS 4
  src/App.jsx                 Routes and app layout
  src/features/               Screens grouped by feature
  src/services/apiClient.js   API calls through the shared Axios client
backend/      Java 17, Spring Boot 3, Gradle
  src/main/java/com/wellfitness/features/  Controllers, services, repositories, entities
  src/main/java/com/wellfitness/common/    Shared responses and security
  sql/                        Production schema migrations
.github/workflows/deploy.yml  Build and validation workflow
```

The frontend sends a JWT to `/api` endpoints. Check the controller response shape before changing an API call.

## Run locally on Windows

Install Java 17, Node.js, and MySQL. Use a local MySQL database on port 3306 and provide the backend's ignored `src/main/resources/application-dev.properties` with your local database and authentication settings. The default Spring profile is `dev`; local Hibernate schema updates are enabled through that profile. The [frontend setup guide](frontend/README.md) has more detail.

In one PowerShell terminal:

```powershell
cd backend
.\gradlew.bat bootRun
```

In a second terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. The local frontend defaults to `http://localhost:8080/api`; set `VITE_API_URL` if your API is elsewhere. To run the three services with Docker instead, see [`docker-compose.yml`](docker-compose.yml) and the [frontend setup guide](frontend/README.md). Docker Compose receives Azure variables from its launching environment or a root `.env`; `backend/.env` is for the local Spring Boot run.

## Checks and deployment

```powershell
cd frontend
npm run build
npm run lint
```

```powershell
cd backend
.\gradlew.bat test
```

The [GitHub Actions workflow](.github/workflows/deploy.yml) validates both apps and builds the backend image on pushes to `main` or `dev`. The frontend is connected to Vercel for production deployments from `main`. The repository workflow does **not** publish or deploy the backend image; backend hosting needs a separate deployment process.

For production MySQL, apply the relevant scripts in [`backend/sql`](backend/sql/) before deploying schema-dependent features. In particular, diet logging and dated body measurements have migrations described in [`backend/DIET_AI_SETUP.md`](backend/DIET_AI_SETUP.md).
