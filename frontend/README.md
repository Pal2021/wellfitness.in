# React + Vite

## Local development (VS Code PowerShell)

Use Java 17 and a running local MySQL database on port 3306, with credentials matching the backend's local configuration. The Compose database is internal to Docker and is not available on host port 3306.

From the repository root, start the backend in one terminal:

```powershell
cd .\backend
.\gradlew.bat bootRun
```

Keep that terminal running; Gradle's `EXECUTING` display is normal for a web server. In a second terminal, from the repository root:

```powershell
cd .\frontend
npm ci
npm.cmd run dev -- --host localhost --port 5173 --strictPort
```

Open http://localhost:5173. The frontend calls http://localhost:8080/api. Stop each server with Ctrl+C in its own terminal. To check the frontend build, run `npm run build`.

## Run the full project with Docker

Start Docker Desktop, stop any local backend/frontend servers, and run from the repository root:

```powershell
docker compose up -d --build
```

Open http://localhost. Nginx forwards `/api` to the internal backend container; the backend does not reserve a host port. MySQL is internal to Compose, so it does not conflict with a locally installed MySQL service. Docker uses the existing `mysql_data` volume, not your host MySQL database; host records are not imported automatically. This local Compose setup enables Hibernate schema updates.

```powershell
docker compose ps
docker compose logs --tail 50 backend
docker compose down
```

Stopping with `down` preserves database data; do not add `-v` unless you intend to delete it. Local development credentials and dependency/build directories are excluded from Docker build contexts. Email delivery requires `RESEND_API_KEY` and `APP_EMAIL_FROM` in the launching environment; Google login uses the same public OAuth client ID for the frontend build and backend verification. Compose defaults to the app's existing client; set `GOOGLE_CLIENT_ID` to override both and run `docker compose up -d --build` again. In that client's Google Cloud Console settings, authorize the exact JavaScript origin `http://localhost` (and `http://localhost:5173` for Vite). A backend audience mismatch returns 401 even after Google sign-in succeeds. Azure configuration is optional and passed through from the launching environment. Missing provider credentials leave those features unavailable.

## Public pages

The public landing page (`/`) and login page (`/login`) use scoped, responsive styles in their feature folders. The login layout stacks on mobile and shows an introduction beside the form on desktop. Email/password, Google sign-in, and registration navigation retain their existing flows. Both pages support visible keyboard focus and reduced-motion preferences.

## Diet food logging

In **Diet → Log food**, enter a food name, the serving eaten, and optional **Ingredients / remarks** with ingredient quantities and cooking method. **Estimate nutrition with AI** sends those three fields to the backend's authenticated `POST /api/diet/nutrition-estimate` endpoint and fills calories, protein, carbs, and fat for that serving.

Estimates are approximate. All fields remain editable, including when reopening a saved entry. Review or replace any number before **Save food**; estimating never saves automatically. Edits made while an estimate is loading are kept instead of being overwritten by the response. If AI is unavailable, enter nutrition manually and save normally (serving and remarks are optional for manual logging). Remarks are saved with the entry.

The backend needs Azure configuration; see [diet AI setup](../backend/DIET_AI_SETUP.md). No Azure credentials belong in the frontend.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
