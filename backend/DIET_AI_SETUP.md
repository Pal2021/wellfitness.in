# Diet diary, Azure AI meal ideas and nutrition estimation

The Diet tab saves meal entries and optional user-set daily targets in MySQL through the authenticated `/api/diet` endpoints. It works without an AI key.

Local development uses Hibernate `ddl-auto=update`. Production does not, so apply [`sql/2026_11_08_diet.sql`](sql/2026_11_08_diet.sql), then the additive [`sql/2026_11_08_diet_remarks.sql`](sql/2026_11_08_diet_remarks.sql), once each to the production MySQL database before deploying the new backend. The remarks migration preserves existing entries with `NULL` remarks.

Meal ideas use the Azure OpenAI **Responses API** on your Azure AI Foundry GPT-5 deployment. Set these environment variables for the backend process:

| Variable | Value |
| --- | --- |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI resource URL, such as `https://YOUR-RESOURCE.openai.azure.com` or `https://YOUR-RESOURCE.services.ai.azure.com` |
| `AZURE_OPENAI_DEPLOYMENT` | The exact **deployment name** of your GPT-5 model in Foundry |
| `AZURE_OPENAI_API_KEY` | An API key for that Azure resource |

The backend appends `/openai/v1/responses` to the resource URL. It also accepts an endpoint already ending in `/openai/v1`. The v1 route does not need an `api-version` parameter. See [Microsoft's Responses API guide](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/responses) and [v1 endpoint guide](https://learn.microsoft.com/en-us/azure/foundry/openai/api-version-lifecycle).

For a local PowerShell session, set the variables in the terminal that starts the backend:

```powershell
$env:AZURE_OPENAI_ENDPOINT = 'https://YOUR-RESOURCE.openai.azure.com'
$env:AZURE_OPENAI_DEPLOYMENT = 'YOUR-GPT-5-DEPLOYMENT-NAME'
$env:AZURE_OPENAI_API_KEY = '<your-key>'
.\gradlew.bat bootRun
```

Keep the key out of source files and the frontend. After changing these variables, restart the backend. If Azure is not configured or is unavailable, meal logging still works and the suggestion request returns a clear unavailable message.

The suggestion call sends the selected day's food names, totals, targets, fitness goal, and the preferences entered for that request to Azure. It does not send the user's name or email. Suggestions are not saved as food entries, and their nutrition values are not assumed.

## Nutrition estimation contract

`POST /api/diet/nutrition-estimate` requires the same authenticated JWT as the diary. It reuses the Azure resource, deployment, Responses API transport, timeouts, and `store: false` setting above; no extra key or resource is needed.

```json
{"foodName":"Dal and rice","serving":"1 bowl","remarks":"150g cooked rice, 100g dal, 5g oil"}
```

- `foodName`: required, nonblank, at most 120 characters.
- `serving`: required, nonblank, at most 80 characters. The property is **`serving`, not `servingSize`**, matching saved entries.
- `remarks`: optional/null, at most 1000 characters; ingredients and quantities improve the estimate.

Successful response is `ApiResponse<NutritionValues>` using the existing field names:

```json
{"success":true,"data":{"calories":420,"proteinGrams":15.2,"carbsGrams":70.0,"fatGrams":8.5},"message":"Operation successful"}
```

Calories must be integer 0–10000. Each macro must be numeric 0–1000 grams with at most one decimal place. The backend rejects missing, null, extra, duplicate, string-valued, out-of-range, or over-precision model fields, malformed JSON, refusals and unfinished responses instead of returning invented fallback values. These are approximate estimates, not medical advice or verified nutritional analysis.

An estimate sends only the submitted food name, serving and remarks to Azure, not the user's identity, diary, or targets. Inputs are passed as data separate from system instructions. Requests are not retried automatically. Invalid input returns HTTP 400 (`VALIDATION_ERROR`); unavailable/misconfigured Azure, timeouts, or invalid model output return HTTP 503 (`AI_UNAVAILABLE`) with a safe message instructing manual entry. Provider bodies and credentials are never included in those error responses. Authentication failures follow the existing security configuration. There is no existing diet per-user cooldown; use deployment-level rate limiting for public production traffic.

Estimation never writes a meal or changes an existing entry. Populate editable fields from the response, let the user review/change the numbers, then explicitly save using `POST /api/diet/entries` or `PUT /api/diet/entries/{entryId}`. Those requests and the entry/day responses now include optional `remarks` (maximum 1000 characters). Remarks are trimmed and persisted on both add and update; sending `null` or omitting remarks on a full update clears it, and an empty string is also accepted. Manual saves/edits continue to work with no Azure configuration, with optional serving and optional macros as before.

## Offline verification

From `backend`, run `.\gradlew.bat test`. Diet controller tests cover authentication, validation, explicit saves and edits; persistence tests flush/clear the database session to verify saved remarks and nutrition. Azure tests use an in-memory mock HTTP transport with placeholder configuration, including meal-suggestion regression coverage. No live Azure request or real credential is needed. Production SQL still needs to be applied separately; the test database is H2, not production MySQL.
