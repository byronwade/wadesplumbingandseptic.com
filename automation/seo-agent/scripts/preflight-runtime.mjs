import {
	assertDeployedSidecarReadiness,
	loadConfig,
	summarizeConfig,
} from "../src/config.mjs";

const config = assertDeployedSidecarReadiness(loadConfig());
console.log(
	JSON.stringify({
		verification: "CONFIGURATION_VERIFIED",
		configuration: summarizeConfig(config),
	}),
);
