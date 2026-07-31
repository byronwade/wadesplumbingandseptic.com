import { defineSandbox } from "eve/sandbox";
import { vercel } from "eve/sandbox/vercel";

// No arbitrary network or persistent workspace is available to agent-generated
// code. Any later egress exception requires a reviewed policy change.
export default defineSandbox({
	backend: vercel({
		timeout: 300000,
		networkPolicy: "deny-all",
	}),
});
