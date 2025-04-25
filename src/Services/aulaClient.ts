import { GatewayClient } from "aula.js";
import { ErrorHelper } from "../Common";

export const aulaClient = new GatewayClient();

const localStorageAddressName = "server-address";
const storedAddress = localStorage.getItem(localStorageAddressName);
if (storedAddress !== null &&
    ErrorHelper.Try(() => new URL(storedAddress)))
{
	aulaClient.withAddress(new URL(storedAddress));
}

const localStorageTokenName = "authorizationToken";
const storedToken = localStorage.getItem(localStorageTokenName);
// This throws when the token is null; Is expected to not throw in future versions of aula.js (current version: 1.0.0-alpha.2).
aulaClient.withToken(storedToken as string);

export function setServerAddress(address: URL)
{
	aulaClient.withAddress(address);
	localStorage.setItem(localStorageAddressName, address.href);
}

export function setToken(token: string | null)
{
	// This throws when the token is null; Is expected to not throw in future versions of aula.js (current version: 1.0.0-alpha.2).
	aulaClient.withToken(token as string);

	if (token !== null)
		localStorage.setItem(localStorageTokenName, token);
	else
		localStorage.removeItem(localStorageTokenName);
}
