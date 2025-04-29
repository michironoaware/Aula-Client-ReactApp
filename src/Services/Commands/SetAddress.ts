import { Command, CommandOption } from "../../Commands";
import { CancellationToken } from "aula.js";
import { LogLevel } from "../../Common/Logging";
import { logging } from "../logging.ts";
import { aula, AulaConnectionState } from "../aula.ts";

export class SetAddress extends Command
{
	static readonly #s_addressOption = new CommandOption({
		name: "addr",
		description: "The address of the server.",
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});

	public constructor()
	{
		super();
		this.addOption(SetAddress.#s_addressOption);
	}

	public get name()
	{
		return "set-address";
	}

	public get description()
	{
		return "Sets the address of the Aula server.";
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken)
	{
		const addressString = args.get(SetAddress.#s_addressOption.name)!;

		let address;
		try
		{
			address = new URL(addressString);
		}
		catch (err)
		{
			if (!(err instanceof TypeError))
				// Unexpected error, rethrow.
				throw err;

			logging.log(LogLevel.Error, "The address is not a valid URI.");
			return;
		}

		logging.log(LogLevel.Information, "Checking in with the server...");
		if (!await aula.rest.ping(address, cancellationToken))
		{
			logging.log(LogLevel.Warning, "The server did not respond. The address may be incorrect or the server is disconnected.");
		}

		aula.setServerAddress(address);
		logging.log(LogLevel.Information, "Address updated!");
		return;
	}
}
