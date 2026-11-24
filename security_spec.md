# Security Specification — Recruits.org.in ITI Manufacturing Hiring Firestore

## 1. Data Invariants
1. **Strict PII Isolation**: Every document in `/itiApplications/{applicationId}` contains sensitive PII (`aadhaarNumber`, `mobileNumber`, `fullName`). No public user, unauthenticated client, or non-admin authenticated user may EVER perform `get`, `list`, `update`, or `delete` on `/itiApplications`.
2. **Verified Admin Only**: Reading, listing, updating pipeline status, adding `adminNotes`, or deleting applications requires an authenticated Google account with `email_verified == true` matching the bootstrapped owner (`recruit.org.contact@gmail.com`) or a trusted `/admins/{uid}` record (single-doc operations).
3. **Create-Only Student Intake**: Public candidates may ONLY `create` a new `/itiApplications/{applicationId}` document with:
   - Valid `applicationId` (`^[a-zA-Z0-9_\-]+$`, max 128 chars)
   - Exact schema key allowlist (no shadow fields)
   - Strict regex validation on `mobileNumber` (`^[6-9][0-9]{9}$`), `aadhaarNumber` (`^[2-9][0-9]{11}$`), `aadhaarMasked` (`^XXXX-XXXX-[0-9]{4}$`), and `applicationRef` (`^REC-ITI-[A-Z0-9\-]{4,24}$`)
   - `consentAccepted == true`
   - Forced initial workflow state: `status == 'new'`, `whatsappShared == false`, `adminNotes == ''`
   - Server-enforced timestamps: `createdAt == request.time` and `updatedAt == request.time`
4. **Immutable Candidate Data**: Even during admin updates, candidate identity fields (`applicationRef`, `fullName`, `mobileNumber`, `aadhaarNumber`, `aadhaarMasked`, `qualification`, `itiTrade`, `homeState`, `district`, `collegeName`, `consentAccepted`, `programSlug`, `createdAt`) are strictly immutable. Only `status`, `whatsappShared`, `adminNotes`, and `updatedAt` may change.
5. **Default-Deny Catch-All**: Any unmatched path returns `PERMISSION_DENIED`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated PII Read (`get`)**: Public user attempts `get(/itiApplications/REC-ITI-2026-1001)` -> `PERMISSION_DENIED`.
2. **Unauthenticated PII Scrape (`list`)**: Public user attempts `list(/itiApplications)` -> `PERMISSION_DENIED`.
3. **Non-Admin Authenticated Scrape**: Logged-in non-admin Gmail user (`student@gmail.com`) attempts `list(/itiApplications)` or `get` -> `PERMISSION_DENIED`.
4. **Spoofed Admin Email (Unverified)**: Attacker with `email: 'recruit.org.contact@gmail.com'` and `email_verified: false` attempts `list(/itiApplications)` -> `PERMISSION_DENIED`.
5. **Shadow / Ghost Field Injection**: Student submits valid payload plus `{ "isVerified": true, "role": "admin" }` -> `PERMISSION_DENIED`.
6. **Status Self-Escalation on Create**: Student submits `{ "status": "shortlisted" }` instead of `"new"` -> `PERMISSION_DENIED`.
7. **Consent Bypass**: Student submits `{ "consentAccepted": false }` -> `PERMISSION_DENIED`.
8. **Invalid Aadhaar / Mobile Format**: Student submits `{ "aadhaarNumber": "12345", "mobileNumber": "0000000000" }` -> `PERMISSION_DENIED`.
9. **ID Poisoning Attack**: Attacker creates `/itiApplications/../../admins/evil` or 200-char junk ID -> `PERMISSION_DENIED`.
10. **Denial-of-Wallet Oversized String**: Attacker submits `fullName` of 5,000 characters or `collegeName` of 2,000 characters -> `PERMISSION_DENIED`.
11. **Backdated / Spoofed Timestamp**: Attacker submits `createdAt` different from `request.time` -> `PERMISSION_DENIED`.
12. **Privilege Escalation via `/admins` Self-Write**: Non-admin user attempts `create(/admins/{uid}, { email: 'evil@test.com', role: 'admin' })` -> `PERMISSION_DENIED`.
