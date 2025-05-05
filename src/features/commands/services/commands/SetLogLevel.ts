import { Command } from "lib/commands/Command.ts";
import { CommandOption } from "lib/commands/CommandOption.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";
import { TypeHelper } from "utils/TypeHelper.ts";
import { CancellationToken } from "aula.js";
import { logging } from "lib/logging.ts";
import { LocalStorageFacade } from "lib/LocalStorageFacade.ts";

export class SetLogLevel extends Command
{
	static readonly #s_logLevelOption = new CommandOption({
		name: "l",
		description: `The log level from which to start logging messages. Valid options are ${Object
			.entries(LogLevel)
			.filter(e => TypeHelper.isType(e[1], LogLevel) && e[1] <= LogLevel.Information && e[1] >= LogLevel.Trace)
			.map(t => `"${t[0]}"`)
			.join(", ")}. Recommended is "${LogLevel[LogLevel.Information]}".`,
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});

	public constructor()
	{
		super();
		this.addOption(SetLogLevel.#s_logLevelOption);
	}

	public get name()
	{
		return "set-loglevel";
	}

	public get description()
	{
		return "Sets the log level from which to start logging messages.";
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken)
	{
		cancellationToken.throwIfCancellationRequested();

		const logLevelString = args.get(SetLogLevel.#s_logLevelOption.name)!;
		if (!isNaN(Number(logLevelString)))
		{
			logging.log(LogLevel.Error, "The level specified is invalid.");
			return;
		}

		const logLevelEntry = Object
			.entries(LogLevel)
			.find(v => v[0].toLowerCase() === logLevelString.toLowerCase());
		if (logLevelEntry === undefined ||
		    typeof logLevelEntry[1] !== "number" ||
		    logLevelEntry[1] < LogLevel.Trace ||
		    logLevelEntry[1] > LogLevel.Information)
		{
			logging.log(LogLevel.Error, "The level specified is invalid.");
			return;
		}

		LocalStorageFacade.logLevel = logLevelEntry[1] as LogLevel;
		logging.log(LogLevel.Information, "Log level updated successfully!");
	}
}
