import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { config } from "../config";

export const cerebras = new Cerebras({
	apiKey: config.cerebras.apiKey,
});
