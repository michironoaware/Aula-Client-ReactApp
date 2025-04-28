import { Command, CommandOption } from "../../Commands";
import { AulaRestError, CancellationToken, LogInRequestBody, LogInResponse, RestClientNullAddressError } from "aula.js";
import { gatewayClient, setToken } from "../gatewayClient.ts";
import { loggers } from "../loggers";
import { LogLevel } from "../../Common/Logging";
import { RestHelper } from "./RestHelper.ts";

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

		let logInAttempt = await RestHelper.HandleRestErrors(
			async () => await gatewayClient.rest.logIn(logInRequestBody));
		if (!logInAttempt.succeeded)
			return;
		let logInResponse = logInAttempt.value;

		setToken(logInResponse.token);

		const currentUser = await gatewayClient.rest.getCurrentUser();
		loggers.log(LogLevel.Information, `Logged in as ${currentUser.displayName}.`);
	}
}
