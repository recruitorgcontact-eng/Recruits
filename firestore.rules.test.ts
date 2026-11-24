/**
 * Phase 0 Payload-First Security TDD Spec for Recruits.org.in Firestore Rules.
 * Verifies all 12 adversarial ("Dirty Dozen") payloads against /itiApplications and /admins.
 * Run with Firebase Emulator Suite & @firebase/rules-unit-testing when executing locally.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  actor: 'anonymous' | 'nonAdminUser' | 'unverifiedAdminSpoof' | 'verifiedAdmin';
  operation: 'create' | 'get' | 'list' | 'update' | 'delete';
  path: string;
  payload?: Record<string, unknown>;
  expected: 'ALLOW' | 'PERMISSION_DENIED';
}

export const VALID_CREATE_PAYLOAD = {
  applicationRef: 'REC-ITI-2026-4821',
  fullName: 'Ramesh Kumar Sahoo',
  mobileNumber: '9861234567',
  aadhaarNumber: '451289341209',
  aadhaarMasked: 'XXXX-XXXX-1209',
  qualification: 'ITI',
  itiTrade: 'Fitter',
  homeState: 'Odisha',
  district: 'Khordha',
  collegeName: 'Government ITI Bhubaneswar',
  consentAccepted: true,
  programSlug: 'iti-manufacturing-diploma-chennai',
  status: 'new',
  whatsappShared: false,
  adminNotes: '',
  createdAt: '__SERVER_TIMESTAMP__',
  updatedAt: '__SERVER_TIMESTAMP__',
};

export const DIRTY_DOZEN_SECURITY_TESTS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated PII Read (get)',
    actor: 'anonymous',
    operation: 'get',
    path: '/itiApplications/REC-ITI-2026-4821',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unauthenticated PII Scrape (list)',
    actor: 'anonymous',
    operation: 'list',
    path: '/itiApplications',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Non-Admin Authenticated Scrape (list)',
    actor: 'nonAdminUser',
    operation: 'list',
    path: '/itiApplications',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Unverified Admin Email Spoof Attack',
    actor: 'unverifiedAdminSpoof',
    operation: 'list',
    path: '/itiApplications',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Shadow / Ghost Field Injection on Create',
    actor: 'anonymous',
    operation: 'create',
    path: '/itiApplications/REC-ITI-2026-4822',
    payload: { ...VALID_CREATE_PAYLOAD, isVerified: true, role: 'admin' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Status Self-Escalation on Create',
    actor: 'anonymous',
    operation: 'create',
    path: '/itiApplications/REC-ITI-2026-4823',
    payload: { ...VALID_CREATE_PAYLOAD, status: 'shortlisted' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Consent Bypass on Create',
    actor: 'anonymous',
    operation: 'create',
    path: '/itiApplications/REC-ITI-2026-4824',
    payload: { ...VALID_CREATE_PAYLOAD, consentAccepted: false },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Malformed Aadhaar and Mobile Format',
    actor: 'anonymous',
    operation: 'create',
    path: '/itiApplications/REC-ITI-2026-4825',
    payload: { ...VALID_CREATE_PAYLOAD, aadhaarNumber: '00001234', mobileNumber: '12345' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Path ID Poisoning (Oversized / Invalid Characters)',
    actor: 'anonymous',
    operation: 'create',
    path: `/itiApplications/${'A'.repeat(200)}`,
    payload: VALID_CREATE_PAYLOAD,
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Denial-of-Wallet Oversized String Field',
    actor: 'anonymous',
    operation: 'create',
    path: '/itiApplications/REC-ITI-2026-4826',
    payload: { ...VALID_CREATE_PAYLOAD, fullName: 'X'.repeat(500) },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Backdated Client Timestamp Injection',
    actor: 'anonymous',
    operation: 'create',
    path: '/itiApplications/REC-ITI-2026-4827',
    payload: { ...VALID_CREATE_PAYLOAD, createdAt: '2020-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Privilege Escalation via /admins Self-Write',
    actor: 'nonAdminUser',
    operation: 'create',
    path: '/admins/attacker-uid-123',
    payload: { email: 'attacker@example.com', role: 'admin', createdAt: '__SERVER_TIMESTAMP__' },
    expected: 'PERMISSION_DENIED',
  },
];
