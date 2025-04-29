import { Command } from "../../Commands";
import { CancellationToken } from "aula.js";
import { aula, AulaConnectionState } from "../aula.ts";

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
		if (aula.connectionState !== AulaConnectionState.Disconnected)
			await aula.disconnect();

		aula.logOutLocally();
		window.location.reload();
	}
}
