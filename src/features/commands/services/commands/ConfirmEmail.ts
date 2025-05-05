import { Command } from "lib/commands/Command.ts";
import { CommandOption } from "lib/commands/CommandOption.ts";
import { CancellationToken, ConfirmEmailQuery } from "aula.js";
import { WebEncoders } from "utils/WebEncoders.ts";
import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";
import { aula } from "lib/aula.ts";

export class ConfirmEmail extends Command
{
	static readonly #s_emailOption = new CommandOption({
		name: "e",
		description: "The email to confirm.",
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});

	static readonly #s_sendEConfirmationEmailOption = new CommandOption({
		name: "send-confirmation-email",
		description: "Sends a confirmation email to the specified email address. " +
		             "If a confirmation token is specified, this argument will be ignored and no email will be sent.",
		isRequired: false,
		requiresArgument: false,
		canOverflow: false,
	});

	static readonly #s_confirmationTokenOption = new CommandOption({
		name: "t",
		description: "The token sent in the confirmation email used to confirm the specified email address.",
		isRequired: false,
		requiresArgument: true,
		canOverflow: false,
	});

	public constructor()
	{
		super();
		this.addOption(ConfirmEmail.#s_emailOption);
		this.addOption(ConfirmEmail.#s_confirmationTokenOption);
		this.addOption(ConfirmEmail.#s_sendEConfirmationEmailOption);
	}

	public get name()
	{
		return "confirm-email";
	}

	public get description()
	{
		return "Provides options to confirm an email address.";
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken): Promise<void>
	{
		let email = args.get(ConfirmEmail.#s_emailOption.name)!;
		let confirmationToken = args.get(ConfirmEmail.#s_confirmationTokenOption.name);
		const sendConfirmationEmailFlag = !!args.get(ConfirmEmail.#s_sendEConfirmationEmailOption.name);
		email = WebEncoders.ToBase64UrlString(email);
		confirmationToken = confirmationToken ? WebEncoders.ToBase64UrlString(confirmationToken) : confirmationToken;

		if (confirmationToken === undefined &&
		    !sendConfirmationEmailFlag)
		{
			logging.log(LogLevel.Warning,
				`No action was selected. Please specify either ` +
				`"${CommandOption.prefix}${ConfirmEmail.#s_confirmationTokenOption.name}" (to confirm with a token) ` +
				`or "${CommandOption.prefix}${ConfirmEmail.#s_sendEConfirmationEmailOption.name}" (to send a confirmation email).`
			);
			return;
		}

		if (confirmationToken !== undefined)
		{
			const confirmEmailQuery = new ConfirmEmailQuery()
				.withEmail(email)
				.withToken(confirmationToken);

			await aula.rest.confirmEmail(confirmEmailQuery, cancellationToken);
			return;
		}

		const confirmEmailQuery = new ConfirmEmailQuery().withEmail(email);
		await aula.rest.confirmEmail(confirmEmailQuery, cancellationToken);

		logging.log(LogLevel.Information,
			"Confirmation email request sent. If an account with the provided email exists, a confirmation email will be sent.");
	}
}
