import {
	CancellationToken,
	GatewayClient,
	GatewayClientOptions,
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
	#_lastSessionId: string | undefined;
	#_state = AulaConnectionState.Disconnected;
	#_tryReconnect = false;

	public constructor()
	{
		this.#_gateway = new GatewayClient(new GatewayClientOptions()
			.withIntents(Intents.Users | Intents.Rooms | Intents.Messages | Intents.Moderation)
			.withRestClientOptions(new RestClientOptions()
				.withCache(new LruCache(256, false))));

		this.#addReconnecting(this.#_gateway);
		this.#loadSettings();
	}

	public get connectionState()
	{
		return this.#_state;
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
		AulaServiceStateError.throwIf(this.#_state !== AulaConnectionState.Disconnected, "Log out first.");

		const logInRequestBody = new LogInRequestBody()
			.withUserName(params.username)
			.withPassword(params.password);
		let logInResponse = await this.#_gateway.rest.logIn(logInRequestBody, params.cancellationToken);

		LocalStorageFacade.authorizationToken = logInResponse.token;
		this.#_gateway.withToken(logInResponse.token);
	}

	public async logOut(params: ILogInParams)
	{
		AulaServiceStateError.throwIf(this.#_state !== AulaConnectionState.Disconnected, "Log out first.");

		const logInRequestBody = new LogInRequestBody()
			.withUserName(params.username)
			.withPassword(params.password);
		await this.#_gateway.rest.logOut(logInRequestBody, params.cancellationToken);

		this.logOutLocally();
	}

	public logOutLocally()
	{
		AulaServiceStateError.throwIf(this.#_state !== AulaConnectionState.Disconnected, "Log out first.");
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

	public async connect()
	{
		InvalidOperationError.throwIf(this.#_state !== AulaConnectionState.Disconnected, "Client is already connected.");
		await this.#_gateway.connect();
		this.#_tryReconnect = true;
	}

	public async disconnect()
	{
		InvalidOperationError.throwIf(this.#_state !== AulaConnectionState.Connected, "Client is not connected.");
		await this.#_gateway.disconnect();
		this.#_tryReconnect = false;
	}

	#addReconnecting(gateway: GatewayClient)
	{
		gateway.on("Ready", event =>
		{
			this.#_state = AulaConnectionState.Connected;
			this.#_lastSessionId = event.sessionId;
		});

		gateway.on("Disconnected", async () =>
		{
			if (!this.#_tryReconnect)
			{
				this.#_state = AulaConnectionState.Disconnected;
				return;
			}

			this.#_state = AulaConnectionState.Connecting;
			while (this.#_state !== AulaConnectionState.Connected)
			{
				if (!this.#_tryReconnect)
				{
					this.#_state = AulaConnectionState.Disconnected;
					return;
				}

				try
				{
					await gateway.connect(this.#_lastSessionId);
					this.#_state = AulaConnectionState.Connected;
				}
				catch (err)
				{
					console.error(err);
					break;
				}
			}
		});
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

export enum AulaConnectionState
{
	Disconnected,
	Connecting,
	Connected,
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
