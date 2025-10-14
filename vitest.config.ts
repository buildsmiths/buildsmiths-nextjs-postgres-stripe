import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      pg: path.resolve(__dirname, 'tests/mocks/pg.ts'),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: 'core-node',
          environment: 'node',
          include: [
            'tests/contract/config_validation.test.ts',
            'tests/contract/env_contract.test.ts',
            'tests/contract/env_keys_snapshot.test.ts',
            'tests/contract/schema_smoke.test.ts',
            'tests/contract/envelope_schema_consistency.test.ts',
            'tests/contract/stripe_webhook.test.ts',
            'tests/contract/stripe_webhook_envelope_error.test.ts',
            'tests/contract/subscriptions_checkout_envelope.test.ts',
            'tests/contract/subscriptions_portal_envelope.test.ts',
            'tests/contract/subscriptions_checkout_disabled.test.ts',
            'tests/contract/subscriptions_portal_disabled.test.ts',
            'tests/contract/premium_feature_envelope.test.ts',
            'tests/contract/auth_status_envelope.test.ts',
            'tests/contract/auth_status_free_envelope.test.ts',
            'tests/integration/upgrade_flow.test.ts',
            'tests/integration/webhook_idempotency.test.ts',
            'tests/integration/stripe_placeholder_mode.test.ts',
            'tests/integration/session_precedence.test.ts',
            'tests/integration/cookie_session.test.ts',
            'tests/integration/oauth_callback_redirect.test.ts',
            'tests/integration/dashboard_signed_out.test.ts',
            'tests/integration/dashboard_premium_smoke.test.ts',
            'tests/integration/account_page_signed_in.test.tsx',
            'tests/integration/account_page_prod_dev_bearer_disabled.test.tsx',
            'tests/integration/account_ssr_no_client_fetch.test.tsx',
            'tests/unit/auth_redirect.test.ts',
            'tests/unit/auth_signout_clears_session.test.tsx',
          ],
          exclude: ['DELETED/**'],
          globals: true,
          setupFiles: [
            'tests/setup/patch-pg.js',
            'tests/setup/env.ts',
            'tests/setup/db-reset.ts',
            'tests/setup/testing-library.ts',
          ],
        },
      },
      {
        test: {
          name: 'core-ui',
          environment: 'jsdom',
          include: [
            'tests/ui/header_nav_accessibility.test.tsx',
            'tests/ui/dashboard_aria_current.test.tsx',
            'tests/ui/skip_to_content_link.test.tsx',
            'tests/ui/billing_disabled_notice.test.tsx',
          ],
          exclude: ['DELETED/**'],
          globals: true,
          setupFiles: [
            'tests/setup/patch-pg.js',
            'tests/setup/env.ts',
            'tests/setup/testing-library.ts',
          ],
        },
      },
    ],
  },
});
