// PostHog Analytics
import posthog from 'posthog-js';

if (import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
  });
}

export { posthog };
