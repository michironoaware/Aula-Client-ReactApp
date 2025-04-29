import { Command, CommandOption } from "../../Commands";
import { CancellationToken, RegisterRequestBody } from "aula.js";
import { LogLevel } from "../../Common/Logging";
import { logging } from "../LoggingService.ts";
import { aula } from "../aula.ts";

export class Register extends Command
{
	static readonly #s_usernameOption = new CommandOption({
		name: "u",
		description: "The username to register the account with. " +
		             "Used for authentication and account related operations, only visible for you. " +
		             "Cannot be changed later.",
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});
	static readonly #s_passwordOption = new CommandOption({
		name: "p",
		description: "The password for the account.",
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});
	static readonly #s_passwordConfirmationOption = new CommandOption({
		name: "pc",
		description: "The password for the account, written again.",
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});
	static readonly #s_emailOption = new CommandOption({
		name: "e",
		description: "The email to register the account with. Cannot be changed later.",
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});
	static readonly #s_displayNameOption = new CommandOption({
		name: "d",
		description: "The display name for the account. Defaults to the username.",
		isRequired: false,
		requiresArgument: true,
		canOverflow: true,
	});

	public constructor()
	{
		super();
		this.addOption(Register.#s_usernameOption);
		this.addOption(Register.#s_displayNameOption);
		this.addOption(Register.#s_emailOption);
		this.addOption(Register.#s_passwordOption);
		this.addOption(Register.#s_passwordConfirmationOption);
	}

	public get name()
	{
		return "register";
	}

	public get description()
	{
		return "Create a new user account.";
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken): Promise<void>
	{
		const username = args.get(Register.#s_usernameOption.name)!;
		const password = args.get(Register.#s_passwordOption.name)!;
		const passwordConfirmation = args.get(Register.#s_passwordConfirmationOption.name)!;
		const email = args.get(Register.#s_emailOption.name)!;
		const displayName = args.get(Register.#s_displayNameOption.name) ?? null;

		if (password !== passwordConfirmation)
		{
			logging.log(LogLevel.Error, "Passwords doesn't match.");
			return;
		}

		const registerRequestBody = new RegisterRequestBody()
			.withUserName(username)
			.withPassword(password)
			.withEmail(email)
			.withDisplayName(displayName);
		await aula.rest.register(registerRequestBody, cancellationToken);

		logging.log(LogLevel.Information, "Registered successfully.");
	}
}
