/**
 * Vercel Production runs the standing Cron → Connect draft-PR path unless an
 * owner sets SEO_AGENT_FORCE_OBSERVE=true. Stale dashboard observe/kill-switch
 * values must not block that path when the code on main intends propose mode.
 */
export function isStandingProductionPropose(env = process.env) {
	const onVercelProduction =
		env.VERCEL_ENV === "production" || env.SEO_AGENT_ENV === "production";
	return onVercelProduction && env.SEO_AGENT_FORCE_OBSERVE !== "true";
}
