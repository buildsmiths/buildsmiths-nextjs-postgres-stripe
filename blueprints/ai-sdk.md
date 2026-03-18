# Spec: AI SDK Integration

## Goal
Implement a standardized AI chat and completion interface utilizing the modern Vercel AI SDK Core. Enable streaming interfaces with minimal boilerplate.

## Architecture Decisions
- Config: Store AI provider settings and configurations in `lib/ai/provider.ts` (e.g., using `@ai-sdk/openai` configured for OpenRouter or OpenAI).
- Backend: Expose standard streaming routes (e.g. `app/api/chat/route.ts`) acting as standard React Route Handlers.
- Frontend: Use standard React hooks provided by the Vercel AI SDK, primarily `useChat`.
- Model: Support switching underlying models seamlessly via standard environment variables.

## Constraints & Rules
- Strict TypeScript must be used for tool definitions and responses (using `zod`).
- Use the modern `streamText` and `generateText` APIs from the `ai` package. Avoid legacy helpers like `OpenAIStream`.
- Keep API keys strictly server-side. Ensure no API keys or secrets are leaked to the client bundle.
- Apply rate limiting on the API route utilizing the existing `lib/rate-limit.ts` logic to prevent abuse.

## Acceptance Criteria
- [ ] Secure route handler correctly accepts and processes chat messages.
- [ ] UI accurately streams responses in real-time.
- [ ] Provider configuration limits API key exposure to server contexts.
- [ ] Rate limits successfully trigger upon excessive requests.
