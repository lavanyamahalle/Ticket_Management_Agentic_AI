 # 📝 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Tickets

- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets` - Get all tickets for logged-in user
- `GET /api/tickets/:id` - Get ticket details

### Admin

- `GET /api/auth/users` - Get all users (Admin only)
- `POST /api/auth/update-user` - Update user role & skills (Admin only)
 .
  Restart the backend (so changes take effect)
   ```powershell
   cd 'c:\Users\lavan\Downloads\AI-ticket-system-main\AI-ticket-system-main\ai-ticket-assistant'
   npm run dev
   ```
   - If you already had the server running under nodemon, it may auto-restart. Otherwise run the above.
 

    $body = @{ email = "test@example.com"; password = "Password123" } | ConvertTo-Json
   $login = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method Post -ContentType 'application/json' -Body $body
   $token = $login.token


 $ticketBody = @{ title = "Database Connection Issue"; description = "Experiencing intermittent database connection timeouts" } | ConvertTo-Json
   $created = Invoke-RestMethod -Uri 'http://localhost:3000/api/tickets' -Method Post -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } -Body $ticketBody
   $created




   on postman


GitHub Copilot: Summarized conversation history

lavanyamahalle: how to test api  endpoint using postman

GitHub Copilot: Created 4 todos

Good — here’s a short, practical guide to test your backend API with Postman (step‑by‑step, with example requests and a small test script to save the JWT so subsequent requests use it).

## Quick checklist before you start
- Backend running: start your server in `ai-ticket-assistant`
  ```powershell
  cd 'c:\Users\lavan\Downloads\AI-ticket-system-main\AI-ticket-system-main\ai-ticket-assistant'
  npm run dev
  ```
- Base API URL: http://localhost:3000/api

## 1) Create a Postman Environment
1. In Postman click the gear icon → Manage Environments → Add.
2. Name it e.g. `local`.
3. Add variables:
   - `base_url` = `http://localhost:3000/api`
   - `token` = (leave blank for now)
4. Save and select this environment in the top-right dropdown.

## 2) Test Signup (create user)
- Request
  - Method: POST
  - URL: `{{base_url}}/auth/signup`
  - Headers:
    - Key: `Content-Type` → Value: `application/json`
  - Body → Raw → JSON:
    ```json
    {
      "email": "test@example.com",
      "password": "Password123"
    }
    ```
- Send. Expected: JSON with `user` and `token` (HTTP 200/201).
- If you get 500: check backend console and `ai-ticket-assistant/logs/backend.log`.

## 3) Test Login and capture JWT into environment
- Request
  - Method: POST
  - URL: `{{base_url}}/auth/login`
  - Headers: `Content-Type: application/json`
  - Body:
    ```json
    {
      "email": "test@example.com",
      "password": "Password123"
    }
    ```
- Add a small Test script (Postman tab “Tests”) to save token automatically:
  ```javascript
  const json = pm.response.json();
  if (json.token) {
    pm.environment.set("token", json.token);
  }
  ```
- Send. After success you should see `token` populated in the Environment (gear → Manage Environments → local → token).

## 4) Test Protected endpoint: Create Ticket
- Request
  - Method: POST
  - URL: `{{base_url}}/tickets`
  - Headers:
    - `Content-Type: application/json`
    - `Authorization: Bearer {{token}}`
  - Body:
    ```json
    {
      "title": "Database Connection Issue",
      "description": "Experiencing intermittent database connection timeouts"
    }
    ```
- Send. Expected: HTTP 201 with message and `ticket` object.
- If 401/Access Denied:
  - Confirm `token` is set in the environment.
  - Inspect the Authorization header in Postman Console (View → Show Postman Console).

## 5) Test Read endpoints
- GET all tickets: GET `{{base_url}}/tickets` with Authorization header
- GET ticket details: GET `{{base_url}}/tickets/:id` with Authorization

## 6) Useful Postman features
- Postman Console (View → Show Postman Console) — shows actual request headers and body, useful to confirm `Authorization` is sent exactly as `Bearer <token>`.
- Save requests into a Collection; you can run the collection with the Collection Runner.
- In Tests tab you can add assertions:
  ```javascript
  pm.test("status is 201", () => pm.response.to.have.status(201));
  ```

## 7) Troubleshooting tips
- If `token` is empty after login:
  - Verify the login response contains a `token` field (check response JSON).
  - If not, check backend logs in `ai-ticket-assistant/logs/backend.log` or console for stack traces.
- If you see 500 errors:
  - Paste the server console stack trace here (or open `ai-ticket-assistant/logs/backend.log`).
- If CORS/OPTIONS errors in browser: Postman bypasses CORS (so it’s a good test if browser requests fail).

## 8) Advanced: Pre-request script to auto-login (optional)
You can put a pre-request script in a request or folder to fetch token automatically if not present:
```javascript
if (!pm.environment.get("token")) {
  pm.sendRequest({
    url: pm.environment.get("base_url") + "/auth/login",
    method: 'POST',
    header: 'Content-Type: application/json',
    body: {
      mode: 'raw',
      raw: JSON.stringify({ email: 'test@example.com', password: 'Password123' })
    }
  }, function (err, res) {
    if (!err) {
      const json = res.json();
      pm.environment.set("token", json.token);
    }
  });
}
```
(Be careful with storing credentials in scripts; only use for local testing.)

## Short example run order
1. POST `{{base_url}}/auth/signup` (or create a user in DB)
2. POST `{{base_url}}/auth/login` (Tests script stores `token`)
3. POST `{{base_url}}/tickets` (use Authorization: Bearer {{token}})
4. GET `{{base_url}}/tickets` to verify

---

If you want, I can:
- Export a Postman collection and environment for you (I can create files in the repo).
- Add a pre-made Test script for each endpoint that asserts the expected JSON.
- Walk you through using the Postman Collection Runner to run a scenario automatically.

Which of those would help you next?

lavanyamahalle:  $ticketBody = @{ title = "Database Connection Issue"; description = "Experiencing intermittent database connection timeouts" } | ConvertTo-Json
   $created = Invoke-RestMethod -Uri 'http://localhost:3000/api/tickets' -Method Post -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } -Body $ticketBody
   $created

   to see tickets created using this

GitHub Copilot: Summarized conversation history

lavanyamahalle: @agent Try Again

GitHub Copilot: I'll read the backend ticket controller to confirm the response shape so I can give exact PowerShell commands to list all tickets or view the created ticket by id. I'll open `ai-ticket-assistant/controllers/ticket.js` and then show the commands and quick Postman steps. Expected outcome: exact PowerShell commands that work locally. 

Read [](file:///c%3A/Users/lavan/Downloads/AI-ticket-system-main/AI-ticket-system-main/ai-ticket-assistant/controllers/ticket.js)

Updating the session todo list to add a "List/view created tickets" item and mark it in-progress so I can track this step. I'll write the full todo list now. Expected outcome: new item created and set to in-progress. 

Added 1 todo

I'll mark the "List/view created tickets" todo completed and return the PowerShell commands you can run to list all tickets and view the one you just created. Expected outcome: updated todo list and clear PowerShell snippets you can paste into your terminal. 

Completed (5/5) *List/view created tickets*

I'll show exact PowerShell commands that use the token you already have and the $created result to list all tickets and view the created ticket by id. Then I'll explain the response shapes so you know what fields to expect.

What I'll do next
- Provide PowerShell snippets to:
  - GET all tickets (for the current user / admin behavior)
  - GET the single ticket you created by id (from $created)
  - Pretty-print JSON in PowerShell for readability
- Explain what the controller returns so you can inspect fields

PowerShell commands to run (paste into your PowerShell session)

1) List all tickets for the authenticated user (or all tickets if your user is admin):
# Get all tickets (uses $token from your earlier login)
$headers = @{ Authorization = "Bearer $token" }
$allTickets = Invoke-RestMethod -Uri 'http://localhost:3000/api/tickets' -Method Get -Headers $headers
# Pretty-print
$allTickets | ConvertTo-Json -Depth 5

2) View the single ticket you just created (use the id in $created.ticket._id or $created.ticket.id depending on response)
# Get id from $created (try both shapes)
$ticketId = $null
if ($created -and $created.ticket -and $created.ticket._id) { $ticketId = $created.ticket._id }
elseif ($created -and $created.ticket -and $created.ticket.id) { $ticketId = $created.ticket.id }
elseif ($created -and $created._id) { $ticketId = $created._id }
else { Write-Host "Couldn't find ticket id in `$created`. Inspect `$created` variable manually: `\$created | ConvertTo-Json -Depth 5`"; exit }

# GET by id
$ticket = Invoke-RestMethod -Uri "http://localhost:3000/api/tickets/$ticketId" -Method Get -Headers $headers
# Pretty-print (controller returns { ticket: {...} })
$ticket | ConvertTo-Json -Depth 6

Notes about response shapes (from ticket.js)
- POST /api/tickets (createTicket) returns:
  {
    message: "Ticket created and processing started",
    ticket: { ...newTicket document... }
  }
  So the created ticket is in `$created.ticket` (and the id is `$created.ticket._id`).

- GET /api/tickets (getTickets) returns:
  - For admin/roles not "user": an array of ticket documents (populated assignedTo)
  - For normal "user" role: an array of tickets limited to fields: title, description, status, createdAt
  So `$allTickets` will be an array (or a single object if only one and PowerShell unwraps).

- GET /api/tickets/:id (getTicket) returns:
  { ticket: { ...ticket document... } }

Troubleshooting tips
- If you get 401 Unauthorized: ensure $token is still set and valid. Re-run login to get a fresh token.
- If Invoke-RestMethod fails with JSON parse errors: wrap the response check with -SkipHttpErrorCheck approach or use Invoke-WebRequest and then parse the Content manually:
  $r = Invoke-WebRequest -Uri "http://localhost:3000/api/tickets/$ticketId" -Headers $headers -Method Get
  $json = $r.Content | ConvertFrom-Json
  $json | ConvertTo-Json -Depth 6

Quick verification step you can paste now (uses $created and $token from your previous commands)
$headers = @{ Authorization = "Bearer $token" }
# Show created
Write-Host "Created object:"
$created | ConvertTo-Json -Depth 6
# Show fetched by id
if ($created -and $created.ticket -and $created.ticket._id) {
  $id = $created.ticket._id
  $f = Invoke-RestMethod -Uri "http://localhost:3000/api/tickets/$id" -Method Get -Headers $headers
  Write-Host "Fetched by id:"
  $f | ConvertTo-Json -Depth 6
} else {
  Write-Host "Ticket id not found in `$created`. Inspect the variable:"
  $created | ConvertTo-Json -Depth 6
}

If you'd like, I can also:
- Show an example curl/Postman request body and expected response.
- Add a small script (PowerShell or Node) to list tickets and save them to a file.
Tell me which of those you'd like next.

lavanyamahalle: give me the commands

GitHub Copilot: I'll give you copy-paste PowerShell commands to (A) list all tickets and (B) fetch the ticket you just created (using your existing $token and $created variables).

List all tickets (uses $token)
```powershell
# set auth header (reuse your $token)
 "$headers = @{ Authorization =Bearer $token" }

# fetch all tickets
$allTickets = Invoke-RestMethod -Uri 'http://localhost:3000/api/tickets' -Method Get -Headers $headers

# pretty-print JSON (increase Depth if nested)
$allTickets | ConvertTo-Json -Depth 6
```

Pretty-table view (quick readable summary)
```powershell
# convert results to a simple table (handles arrays or single object)
@($allTickets) | ForEach-Object {
  [PSCustomObject]@{
    Id        = $_._id
    Title     = $_.title
    Status    = $_.status
    CreatedAt = $_.createdAt
    Assigned  = if ($_.assignedTo) { if ($_.assignedTo -is [array]) { ($_.assignedTo | ForEach-Object { $_.email }) -join ', ' } else { $_.assignedTo.email } } else { '' }
  }
} | Format-Table -AutoSize
```

Fetch the ticket you just created (use $created)
```powershell
# derive id from the $created object safely
$ticketId = $null
if ($created -and $created.ticket -and $created.ticket._id) { $ticketId = $created.ticket._id }
elseif ($created -and $created.ticket -and $created.ticket.id) { $ticketId = $created.ticket.id }
elseif ($created -and $created._id) { $ticketId = $created._id }
else { Write-Host "Ticket id not found in `$created`. Inspect with: `$created | ConvertTo-Json -Depth 6`"; exit }

# GET by id
$ticketResp = Invoke-RestMethod -Uri "http://localhost:3000/api/tickets/$ticketId" -Method Get -Headers $headers

# controller returns { ticket: {...} } so show inner object
if ($ticketResp.ticket) { $ticketResp.ticket | ConvertTo-Json -Depth 8 } else { $ticketResp | ConvertTo-Json -Depth 8 }
```

If Invoke-RestMethod fails with parsing or HTTP errors, use Invoke-WebRequest and parse the Content
```powershell
$r = Invoke-WebRequest -Uri 'http://localhost:3000/api/tickets' -Method Get -Headers $headers -ErrorAction Stop
$data = $r.Content | ConvertFrom-Json
$data | ConvertTo-Json -Depth 8
```

Quick verification snippet (show created object then fetch it)
```powershell
# show what $created contains
Write-Host "Created object:"
$created | ConvertTo-Json -Depth 6

# fetch by id (re-using the logic above)
# ...copy the ticketId extraction and GET code here...
```

Notes
- POST /api/tickets returns { message: "...", ticket: { ... } } — so the created id is normally in `$created.ticket._id`.
- GET /api/tickets returns an array of ticket documents (admin sees more fields; regular users get a subset).
- GET /api/tickets/:id returns { ticket: { ... } }.
- If you get 401, re-run login to refresh $token.
- If you want, I can add a tiny PowerShell script file (e.g., `list-tickets.ps1`) that wraps these steps and writes results to a file — tell me if you'd like that.