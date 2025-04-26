import { Command, CommandOption } from "../../Commands";
import { CancellationToken } from "aula.js";
import { LogLevel } from "../../Common/Logging";
import { loggers } from "../loggers.ts";
import { LocalStorageFacade } from "../LocalStorageFacade.ts";

export class SetLogLevel extends Command
{
	static readonly #s_logLevelOption = new CommandOption({
		name: "l",
		description: `The log level from which to start logging messages. Valid options are ${Object
			.values(LogLevel)
			.filter(v => typeof v === "string")
			.map(t => `"${t}"`)
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
			loggers.log(LogLevel.Error, "The level specified is invalid.");
			return;
		}

		const logLevelEntry = Object
			.entries(LogLevel)
			.find(v => v[0].toLowerCase() === logLevelString.toLowerCase());
		if (logLevelEntry === undefined || typeof logLevelEntry[1] !== "number")
		{
			loggers.log(LogLevel.Error, "The level specified is invalid.");
			return;
		}

		LocalStorageFacade.logLevel = logLevelEntry[1] as LogLevel;
	}
}
