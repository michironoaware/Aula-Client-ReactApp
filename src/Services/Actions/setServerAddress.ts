import { LocalStorageFacade } from "../LocalStorageFacade.ts";
import { gatewayClient } from "../gatewayClient.ts";

export function setServerAddress(address: URL)
{
	LocalStorageFacade.serverAddress = address;
	gatewayClient.withAddress(address);
}
