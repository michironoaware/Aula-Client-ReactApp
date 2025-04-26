import { GatewayClient } from "aula.js";
import { LocalStorageFacade } from "../Services";

export const aulaClient = new GatewayClient();

const storedAddress = LocalStorageFacade.serverAddress;
if (storedAddress !== null)
	aulaClient.withAddress(new URL(storedAddress));

const storedToken = LocalStorageFacade.authorizationToken;
aulaClient.withToken(storedToken);

export function setServerAddress(address: URL)
{
	LocalStorageFacade.serverAddress = address;
	aulaClient.withAddress(address);
}

export function setToken(token: string | null)
{
	LocalStorageFacade.authorizationToken = token;
	aulaClient.withToken(token);
}
