import { Command } from "lib/commands/Command.ts";
import { CancellationToken, GatewayClientState } from "aula.js";
import { aula } from "lib/aula.ts";
import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";

export class LogOut extends Command
{
	public get name()
	{
		return "logout";
	}

	public get description()
	{
		return "Sign out of your account on this device.";
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken): Promise<void>
	{
		if (aula.gateway.state !== GatewayClientState.Disconnected)
			await aula.gateway.disconnect();

		aula.logOutLocally();
		window.location.reload();
	}
}
