import { LogLevel } from "../Common/Logging";
import { InvalidOperationError } from "aula.js";

export default function Log(args: LogArgs)
{
	let logLevelClass: string;
	let logLevelName: string;
	switch (args.logLevel)
	{
		case LogLevel.Critical:
			logLevelClass = "loglevel-critical";
			logLevelName = "Critical";
			break;
		case LogLevel.Error:
			logLevelClass = "loglevel-error";
			logLevelName = "Error";
			break;
		case LogLevel.Warning:
			logLevelClass = "loglevel-warning";
			logLevelName = "Warning";
			break;
		case LogLevel.Information:
			logLevelClass = "loglevel-information";
			logLevelName = "";
			break;
		case LogLevel.Debug:
			logLevelClass = "loglevel-debug";
			logLevelName = "Debug";
			break;
		case LogLevel.Trace:
			logLevelClass = "loglevel-trace";
			logLevelName = "Trace";
			break;
		default: throw new InvalidOperationError(`Unexpected log level "${args.logLevel}"`);
	}

	if (logLevelName.length > 0)
		logLevelName += ": "

	return <div className={`log ${logLevelClass}`}>
		<pre>{logLevelName}{args.message}</pre>
	</div>
}

export interface LogArgs
{
	logLevel: LogLevel;
	message: string;
}
