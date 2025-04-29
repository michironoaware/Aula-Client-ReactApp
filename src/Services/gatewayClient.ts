import { GatewayClient, GatewayClientOptions, Intents, LruCache, RestClientOptions } from "aula.js";
import { LocalStorageFacade } from "./LocalStorageFacade";

export const gatewayClient = new GatewayClient(new GatewayClientOptions()
	.withIntents(Intents.Users | Intents.Rooms | Intents.Messages | Intents.Moderation)
	.withRestClientOptions(new RestClientOptions()
		.withCache(new LruCache(256, false))));

const storedAddress = LocalStorageFacade.serverAddress;
if (storedAddress !== null)
	gatewayClient.withAddress(new URL(storedAddress));

const storedToken = LocalStorageFacade.authorizationToken;
gatewayClient.withToken(storedToken);
