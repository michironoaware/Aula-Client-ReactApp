import { Command, CommandOption } from "../../Commands";
import { CancellationToken, ForgotPasswordQuery } from "aula.js";
import { WebEncoders } from "../../Common/WebEncoders.ts";
import { LogLevel } from "../../Common/Logging";
import { aula } from "../aula.ts";
import { logging } from "../logging.ts";

export class ForgotPassword extends Command
{
	static readonly #s_emailOption = new CommandOption({
		name: "e",
		description: "The email of the account to reset the password to.",
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});

	public constructor()
	{
		super();
		this.addOption(ForgotPassword.#s_emailOption);
	}

	public get name()
	{
		return "forgot-password";
	}

	public get description()
	{
		return "Sends a password reset email with a code to reset an account's password.";
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken): Promise<void>
	{
		const email = WebEncoders.ToBase64UrlString(args.get(ForgotPassword.#s_emailOption.name)!);
		await aula.rest.forgotPassword(new ForgotPasswordQuery().withEmail(email), cancellationToken);

		logging.log(LogLevel.Information,
			"Password reset email request sent. If an account with the provided email exists, an email will be sent.");
	}
}
