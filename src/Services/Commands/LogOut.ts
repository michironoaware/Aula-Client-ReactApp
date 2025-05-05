import { Command } from "../../Commands";
import { CancellationToken, GatewayClientState } from "aula.js";
import { aula } from "../aula.ts";
import { logging } from "../logging.ts";
import { LogLevel } from "../../Common/Logging";

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
		logging.log(LogLevel.Information, "Logged out successfully.");
	}
}
