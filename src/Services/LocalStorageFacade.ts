import { ErrorHelper } from "../Common";
import { aulaClient } from "./aulaClient.ts";

/**
 * @sealed
 */
export class LocalStorageFacade
{
	static readonly #s_authorizationTokenLocalStorageName = "authorizationToken";
	static readonly #s_serverAddressLocalStorageName = "serverAddress";

	private constructor()
	{
	}

	public static get authorizationToken()
	{
		return localStorage.getItem(LocalStorageFacade.#s_serverAddressLocalStorageName);
	}

	public static set authorizationToken(value: string | null)
	{
		if (value !== null)
			localStorage.setItem(LocalStorageFacade.#s_serverAddressLocalStorageName, value);
		else
			localStorage.removeItem(LocalStorageFacade.#s_serverAddressLocalStorageName);
	}

	public static get serverAddress()
	{
		const storedAddress = localStorage.getItem(LocalStorageFacade.#s_serverAddressLocalStorageName);
		if (storedAddress !== null)
		{
			let address: URL;
			try
			{
				address = new URL(storedAddress);
			}
			catch (err)
			{
				if (!(err instanceof TypeError))
					// Unexpected error, rethrow.
					throw err;

				return null;
			}

			return address;
		}

		return null;
	}

	public static set serverAddress(value: URL | null)
	{
		if (value !== null)
			localStorage.setItem(LocalStorageFacade.#s_serverAddressLocalStorageName, value.href);
		else
			localStorage.removeItem(LocalStorageFacade.#s_serverAddressLocalStorageName);
	}
}
