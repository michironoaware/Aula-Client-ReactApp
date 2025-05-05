import {
	CancellationToken,
	GatewayClient,
	GatewayClientOptions, GatewayClientState,
	Intents,
	InvalidOperationError,
	LogInRequestBody,
	LruCache,
	RestClientOptions
} from "aula.js";
import { LogLevel } from "../Common/Logging";
import { logging } from "./logging.ts";
import { LocalStorageFacade } from "./LocalStorageFacade.ts";

class AulaService
{
	readonly #_gateway: GatewayClient;

	public constructor()
	{
		this.#_gateway = new GatewayClient(new GatewayClientOptions()
			.withIntents(Intents.Users | Intents.Rooms | Intents.Messages | Intents.Moderation)
			.withRestClientOptions(new RestClientOptions()
				.withCache(new LruCache(256, false))));

		this.#loadSettings();
	}

	public get gateway()
	{
		return this.#_gateway;
	}

	public get rest()
	{
		return this.#_gateway.rest;
	}

	public async logIn(params: ILogInParams)
	{
		AulaServiceStateError.throwIf(this.#_gateway.hasToken, "Log out first.");
		const logInRequestBody = new LogInRequestBody()
			.withUserName(params.username)
			.withPassword(params.password);
		let logInResponse = await this.#_gateway.rest.logIn(logInRequestBody, params.cancellationToken);

		LocalStorageFacade.authorizationToken = logInResponse.token;
		this.#_gateway.withToken(logInResponse.token);
	}

	public async logOut(params: ILogInParams)
	{
		const logInRequestBody = new LogInRequestBody()
			.withUserName(params.username)
			.withPassword(params.password);
		await this.#_gateway.rest.logOut(logInRequestBody, params.cancellationToken);

		this.logOutLocally();
	}

	public logOutLocally()
	{
		AulaServiceStateError.throwIf(!this.gateway.hasToken, "Not logged in.");
		LocalStorageFacade.authorizationToken = null;
		this.#_gateway.withToken(null);
	}

	public setServerAddress(address: URL)
	{
		AulaServiceStateError.throwIf(this.#_gateway.hasToken, "Log out first.");
		LocalStorageFacade.serverAddress = address;
		this.#_gateway.withAddress(address);
	}

	#loadSettings()
	{
		if (LocalStorageFacade.serverAddress !== null)
		{
			this.#_gateway.withAddress(LocalStorageFacade.serverAddress);
			this.#_gateway.withToken(LocalStorageFacade.authorizationToken);
		}
		else
		{
			LocalStorageFacade.authorizationToken = null;
		}
	}
}

export class AulaServiceStateError extends InvalidOperationError
{
	public constructor(message: string)
	{
		super(message);
	}

	public static throwIf(condition: boolean, message: string): asserts condition is false
	{
		if (condition)
			throw new AulaServiceStateError(message);
	}
}

export const aula = new AulaService();

export interface ILogInParams
{
	username: string;
	password: string;
	cancellationToken: CancellationToken;
}
