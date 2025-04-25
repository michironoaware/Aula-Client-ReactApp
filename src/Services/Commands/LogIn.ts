import { Command, CommandOption } from "../../Commands";
import { AulaRestError, CancellationToken, LogInRequestBody, LogInResponse, RestClientNullAddressError } from "aula.js";
import { aulaClient, loggers, setToken } from "..";
import { LogLevel } from "../../Common/Logging";
import { TypeHelper } from "../../Common";
import { SetAddress } from "./SetAddress.ts";

export class LogIn extends Command
{
	static readonly #s_usernameOption = new CommandOption({
		name: "u",
		description: "The username of the user (Do not confuse with the display name).",
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});

	static readonly #s_passwordOption = new CommandOption({
		name: "p",
		description: "The password of the user.",
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});

	public constructor()
	{
		super();
		this.addOptions(LogIn.#s_usernameOption, LogIn.#s_passwordOption);
	}

	public get name()
	{
		return "login";
	}

	public get description()
	{
		return "Sign in to your account.";
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken)
	{
		const logInRequestBody = new LogInRequestBody()
			.withUserName(args.get(LogIn.#s_usernameOption.name)!)
			.withPassword(args.get(LogIn.#s_passwordOption.name)!);

		let logInResponse: LogInResponse;
		try
		{
			logInResponse = await aulaClient.rest.logIn(logInRequestBody, cancellationToken);
		}
		catch (err)
		{
			if (!(err instanceof Error))
			{
				throw err;
			}

			if (err instanceof AulaRestError)
				loggers.log(LogLevel.Error, err.problemDetails?.detail ?? err.message);
			else if (err instanceof RestClientNullAddressError)
				loggers.log(LogLevel.Error, `A server address is required first. Execute "set-address" to set the server-address.`);
			else
				loggers.log(LogLevel.Critical, `An unexpected error occurred. ${(err as Error).message} ${(err as Error).stack}`);

			return;
		}

		setToken(logInResponse.token);

		const currentUser = await aulaClient.rest.getCurrentUser();
		loggers.log(LogLevel.Information, `Logged in as ${currentUser.displayName}.`);
	}
}
