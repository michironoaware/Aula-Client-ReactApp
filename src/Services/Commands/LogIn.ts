import { Command, CommandOption } from "../../Commands";
import { CancellationToken, LogInRequestBody } from "aula.js";
import { logIn } from "../Actions/logIn.ts";

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
		await logIn({ username, password, cancellationToken });
	}
}
