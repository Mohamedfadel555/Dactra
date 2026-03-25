# Backend APIs Needed (Besides MedicalTestsProvider)

The frontend uses **GET /api/MedicalTestsProvider** for listing labs and scan centers. The following are needed for a full experience:

---

## 1. Admin dashboard – Labs / Scans / Doctors tables

- **Issue:** License number and phone sometimes not shown.
- **Needed:** Ensure these endpoints return the following fields (any casing is handled in frontend):
  - **Doctors:** `licenceNo` or `licenseNo` or `licenseNumber`
  - **Labs:** `licenceNo` (or `licenseNo`/`licenseNumber`), `phoneNumber` or `phone`
  - **Scans:** same as Labs

If the backend uses different names, the UI already falls back to `licenceNo`, `licenseNo`, `licenseNumber` and `phoneNumber`, `phone`.

---

## 2. Lab / Scan profile (current user)

- **Current:** Profile page reads provider ID from JWT (`profileId`, `nameid`, `sub`, or `providerId`) and loads provider data.
- **Option A:** Add **GET /api/MedicalTestsProvider/:id** so the frontend can load a single provider by id.
- **Option B:** If only the list endpoint exists, the app already falls back to “fetch all and find by id”. For “my profile”, the backend should either:
  - Return **profileId** (or **providerId**) in the JWT for Lab/Scan users, or
  - Expose **GET /api/MedicalTestsProvider/me** (or Lab/GetMe, Scan/GetMe) that returns the logged-in provider.

---

## 3. Provider services (Lab tests / Scan types)

- **Current:** Services are managed in the UI with local state only (no persistence).
- **Needed:** APIs to persist services, for example:
  - **GET /api/MedicalTestsProvider/:id/services** – list services for a provider
  - **POST /api/MedicalTestsProvider/:id/services** – add service (e.g. name, price, description)
  - **PUT/DELETE** for edit/remove

Or separate controllers, e.g.:

- **Lab:** GET/POST/PUT/DELETE Lab/Services (or Lab/:id/services)
- **Scan:** GET/POST/PUT/DELETE Scan/Services (or Scan/:id/services)

Model per item: e.g. **name**, **price**, **description** (and optional id).

---

## 4. Working hours (Lab / Scan)

- **Current:** “Working hours” is a placeholder on profile and detail pages.
- **Needed:** e.g.:
  - **GET /api/MedicalTestsProvider/:id/working-hours** (or Lab/working-hours, Scan/working-hours for current user)
  - **PUT /api/MedicalTestsProvider/:id/working-hours** (or same for Lab/Scan)

Same structure as Doctor working hours (e.g. days + time ranges) is enough.

---

## 5. Provider detail page – services & working hours for patient

- **Current:** Detail page (/labs/:id) shows profile from MedicalTestsProvider; services and working hours are placeholders.
- **Needed:** Same as (3) and (4): provider-specific **services** and **working hours** so the patient detail page can show real data (e.g. GET by provider id).

---

## Summary

| Feature                     | API (example)                                      | Status / note                          |
|----------------------------|----------------------------------------------------|----------------------------------------|
| List labs & scans          | GET MedicalTestsProvider                           | In use                                 |
| Single provider            | GET MedicalTestsProvider/:id or /me               | Optional; fallback to list + find by id |
| Provider id in JWT         | profileId / providerId in token for Lab/Scan       | Needed for “my profile”                 |
| Provider services CRUD     | MedicalTestsProvider/:id/services or Lab/Scan APIs| Needed for persistence                  |
| Working hours (Lab/Scan)   | MedicalTestsProvider/:id/working-hours or similar  | Needed for profile & patient detail     |
| Admin tables (licence/phone) | allDoctorsInfo, allLabsInfo, allScansInfo       | Ensure response includes these fields   |
