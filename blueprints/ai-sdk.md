# Blueprint: AI SDK Integration (Vercel AI SDK Core)

**Goal**: Implement a standardized detailed pattern for AI chat/completion integration using the Vercel AI SDK, configured for OpenRouter (model agnosticism) by default.

## 1. Objectives
- Enable streaming chat interfaces with minimal boilerplate.
- Support switching models (Claude 3.5 Sonnet, GPT-4o) via environment variables without code changes.
- Ensure strict runtime validation of API keys.

## 2. Dependencies
- `ai`: The core Vercel AI SDK.
- `@ai-sdk/openai`: The generic OpenAI-compatible provider (used for OpenRouter).
- `zod`: For schema validation of tools (if added).

## 3. Architecture & Files
- **Env**: `OPENROUTER_API_KEY` (Added to `lib/env.ts`).
- **Provider**: `lib/ai/provider.ts` - Configures the OpenRouter custom provider instance.
- **Backend**: `app/api/chat/route.ts` - A standard Route Handler implementing `streamText`.
- **Frontend**: Standard `useChat` hook from `ai/react` in UI components.

## 4. Requirements
- **Streaming**: Must use `streamText` for optimal latency.
- **Security**: 
  - API keys must never be exposed to the client.
  - Rate limiting (reuse existing `lib/rate-limit.ts`) should be applied to the API route (e.g., 10 req/min).
- **System Prompt**: Should be configurable (e.g., "You are a helpful assistant").

## 5. Implementation Prompt
> "Implement the AI SDK Blueprint. Install `ai` and `@ai-sdk/openai`. Update `lib/env.ts` to require `OPENROUTER_API_KEY`. Create `lib/ai/provider.ts` to export a configured `openrouter` provider object using the base URL `https://openrouter.ai/api/v1`. Create `app/api/chat/route.ts` that uses `streamText` with the model `deepseek/deepseek-chat` (as a default example). Add a simple rate limit check."

## 6. Constraints
- Use strict TypeScript.
- Do not use the legacy `OpenAIStream` helpers; use the modern `streamText` API from `ai`.
- Handle errors gracefully (try/catch around the stream creation).
