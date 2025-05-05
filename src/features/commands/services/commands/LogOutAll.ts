import { Command } from "lib/commands/Command.ts";
import { CommandOption } from "lib/commands/CommandOption.ts";
import { CancellationToken, GatewayClientState } from "aula.js";
import { aula } from "lib/aula.ts";
import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";

export class LogOutAll extends Command
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
		this.addOption(LogOutAll.#s_usernameOption);
		this.addOption(LogOutAll.#s_passwordOption);
	}

	public get name()
	{
		return "logout-all";
	}

	public get description()
	{
		return "Sign out of your account on all devices.";
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken)
	{
		const username = args.get(LogOutAll.#s_usernameOption.name)!;
		const password = args.get(LogOutAll.#s_passwordOption.name)!;

		if (aula.gateway.state !== GatewayClientState.Disconnected)
			await aula.gateway.disconnect();

		await aula.logOut({ username, password, cancellationToken });
		window.location.reload();
	}
}
