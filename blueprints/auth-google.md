# Spec: Google Authentication

## Goal
Activate and seamlessly integrate Google OAuth Sign-In into the existing NextAuth authentication flow.

## Architecture Decisions
- Config: Add `GoogleProvider` to the existing NextAuth configuration located in `lib/auth/nextauth-options.ts`.
- Environment: Set up conditionally enabled logic tied to the presence of `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- UI: Expose an "enableGoogle" prop to `components/SignInPanel.tsx` allowing it to conditionally render the "Sign in with Google" button.
- DB: Depend on the existing NextAuth logic to map OAuth tokens to the `users` table for account linking.

## Constraints & Rules
- The Credentials (Email/Password) provider must remain fully functional and default. Google Auth should be wholly optional based on environment configuration.
- Do not commit any `.env` secrets or keys.
- Ensure the OAuth redirect URI follows the standard NextAuth route (`[SITE_URL]/api/auth/callback/google`).
- If implementing custom account linking due to the existing Credential flow, ensure it correctly matches upon the verified `email` field.

## Acceptance Criteria
- [ ] Google button naturally conditionally renders when Google API keys are provided.
- [ ] User can authenticate via Google and correctly route to the logged-in dashboard.
- [ ] Google user data properly seeds/links into the underlying `users` database table.
