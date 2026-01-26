# Blueprint: Authentication (Google)

**Goal**: Activate Google OAuth Sign-In for the authentication flow.

## 1. Context
The codebase is pre-configured with **NextAuth.js v4** in `lib/auth/nextauth-options.ts`.
- **Default**: Email/Password (Credentials Provider) is always enabled.
- **Optional**: Google Provider is conditionally enabled if environment variables are detected.
- **UI**: The `app/auth/page.tsx` checks for these variables and automatically renders the "Sign in with Google" button.

## 2. Pre-requisites
- A Google Cloud Platform (GCP) Project.
- OAuth 2.0 Credentials (Client ID & Client Secret) configured in GCP.
- **Environment Variables** (Add these to `.env.local`):
  ```bash
  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...
  ```

## 3. Architecture
- **Config**: `lib/auth/nextauth-options.ts` adds `GoogleProvider` if keys exist.
- **UI**: `components/SignInPanel.tsx` receives an `enableGoogle` prop.
- **Database**: The existing `users` table handles account linking automatically via NextAuth (account linking logic is handled by the `adapter` or internally by NextAuth if using JWT strategy, though this kit uses a custom Credentials flow mixed with JWT. *Note: For full account linking with the custom implementation, ensure email addresses match*).

## 4. Activation Prompt
> "I want to activate the Google Auth Blueprint.
> 1. Help me verify that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env.local`.
> 2. Explain how to configure the **Authorized Redirect URI** in the Google Cloud Console.
>    (Hint: It should be `YOUR_SITE_URL/api/auth/callback/google` e.g., `http://localhost:3000/api/auth/callback/google`).
> 3. Verify that `SignInPanel.tsx` is correctly rendering the Google button when the prop is true."

## 5. Security & Safety
- **Environment Variables**: Never commit secrets to git. Ensure `.env.local` is in `.gitignore`.
- **Redirect URI**: Must match exactly what is registered in GCP to prevent open redirect vulnerabilities.
