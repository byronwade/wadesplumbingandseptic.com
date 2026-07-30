/**
 * Evlog's defineNodeInstrumentation dynamically imports
 * `evlog/next/instrumentation/create` with webpackIgnore, so Vercel file
 * tracing omits that module and register() fails on every Node serverless
 * cold start. That collapses route handlers (including /api/search-index)
 * onto the static /500 page.
 *
 * Keep hooks as no-ops until evlog ships a statically bundleable entry, or
 * we switch to a drain that does not need Node instrumentation.
 */
export async function register() {}

export async function onRequestError() {}
