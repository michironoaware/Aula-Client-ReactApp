import { TypeHelper } from "utils/TypeHelper.ts";
import { ThemeType } from "components/ThemeType.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";

/**
 * @sealed
 */
export class LocalStorageFacade
{
	static readonly #s_authorizationTokenLocalStorageName = "authorizationToken";
	static readonly #s_serverAddressLocalStorageName = "serverAddress";
	static readonly #s_themeLocalStorageName = "theme";
	static readonly #s_logLevelLocalStorageName = "logLevel";

	private constructor()
	{
	}

	public static get authorizationToken()
	{
		return localStorage.getItem(LocalStorageFacade.#s_authorizationTokenLocalStorageName);
	}

	public static set authorizationToken(value: string | null)
	{
		if (value !== null)
			localStorage.setItem(LocalStorageFacade.#s_authorizationTokenLocalStorageName, value);
		else
			localStorage.removeItem(LocalStorageFacade.#s_authorizationTokenLocalStorageName);
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

	public static get theme()
	{
		const storedTheme = Number(localStorage.getItem(LocalStorageFacade.#s_themeLocalStorageName));
		if (TypeHelper.isType(storedTheme, ThemeType))
			return storedTheme;
		return null;
	}

	public static set theme(value: ThemeType | null)
	{
		if (value !== null)
			localStorage.setItem(LocalStorageFacade.#s_themeLocalStorageName, value.toString());
		else
			localStorage.removeItem(LocalStorageFacade.#s_themeLocalStorageName);
	}

	public static get logLevel()
	{
		const storedLogLevel = Number(localStorage.getItem(LocalStorageFacade.#s_logLevelLocalStorageName));
		if (TypeHelper.isType(storedLogLevel, LogLevel))
			return storedLogLevel;
		return null;
	}

	public static set logLevel(value: LogLevel | null)
	{
		if (value !== null)
			localStorage.setItem(LocalStorageFacade.#s_logLevelLocalStorageName, value.toString());
		else
			localStorage.removeItem(LocalStorageFacade.#s_logLevelLocalStorageName);
	}
}
