import { LocalStorageFacade } from "../LocalStorageFacade.ts";
import { gatewayClient } from "../gatewayClient.ts";

export function setToken(token: string | null)
{
	LocalStorageFacade.authorizationToken = token;
	gatewayClient.withToken(token);
}
