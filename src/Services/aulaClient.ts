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
