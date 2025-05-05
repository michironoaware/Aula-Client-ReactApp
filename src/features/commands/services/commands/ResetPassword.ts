import { Command } from "lib/commands/Command.ts";
import { CommandOption } from "lib/commands/CommandOption.ts";
import { CancellationToken, ResetPasswordRequestBody } from "aula.js";
import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";
import { aula } from "lib/aula.ts";

export class ResetPassword extends Command
{
	static readonly #s_codeOption = new CommandOption({
		name: "c",
		description: "The code sent in the password reset email.",
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});

	static readonly #s_passwordOption = new CommandOption({
		name: "p",
		description: "The new password for the account.",
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});

	static readonly #s_passwordConfirmationOption = new CommandOption({
		name: "pc",
		description: "The new password for the account, written again.",
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});

	public constructor()
	{
		super();
		this.addOption(ResetPassword.#s_codeOption);
		this.addOption(ResetPassword.#s_passwordOption);
		this.addOption(ResetPassword.#s_passwordConfirmationOption);
	}

	public get name()
	{
		return "reset-password";
	}

	public get description()
	{
		return "Resets the password for an account.";
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken): Promise<void>
	{
		const code = args.get(ResetPassword.#s_codeOption.name)!;
		const password = args.get(ResetPassword.#s_passwordOption.name)!;
		const passwordConfirmation = args.get(ResetPassword.#s_passwordConfirmationOption.name)!;

		if (password !== passwordConfirmation)
		{
			logging.log(LogLevel.Error, "Passwords doesn't match.");
			return;
		}

		await aula.rest.resetPassword(new ResetPasswordRequestBody()
			.withCode(code)
			.withNewPassword(password), cancellationToken);
		logging.log(LogLevel.Information, "Password reset successful.");
	}
}
