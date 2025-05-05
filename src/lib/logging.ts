import { ILogger } from "utils/logging/ILogger.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";

class LogCollection implements ILogger
{
	readonly #_loggers: ILogger[] = [];

	public add(logger: ILogger)
	{
		this.#_loggers.push(logger);
	}

	public remove(logger: ILogger)
	{
		this.#_loggers.splice(this.#_loggers.indexOf(logger), 1);
	}

	public clear()
	{
		this.#_loggers.length = 0;
	}

	public log(logLevel: LogLevel, message: string)
	{
		for (const logger of this.#_loggers)
		{
			logger.log(logLevel, message);
		}
	}
}

export const logging = new LogCollection();
