import { Command } from "lib/commands/Command.ts";
import { CommandOption } from "lib/commands/CommandOption.ts";
import { CancellationToken } from "aula.js";
import { aula } from "lib/aula.ts";
import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";

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
		const username = args.get(LogIn.#s_usernameOption.name)!;
		const password = args.get(LogIn.#s_passwordOption.name)!;
		await aula.logIn({ username, password, cancellationToken });
		window.location.reload();
	}
}
