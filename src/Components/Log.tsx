import { LogLevel } from "../Common/Logging";
import { InvalidOperationError } from "aula.js";

export default function Log(args: LogArgs)
{
	let logLevelClass: string;
	switch (args.logLevel)
	{
		case LogLevel.Critical: logLevelClass = "loglevel-critical"; break;
		case LogLevel.Error: logLevelClass = "loglevel-error"; break;
		case LogLevel.Warning: logLevelClass = "loglevel-warning"; break;
		case LogLevel.Information: logLevelClass = "loglevel-information"; break;
		case LogLevel.Debug: logLevelClass = "loglevel-debug"; break;
		case LogLevel.Trace: logLevelClass = "loglevel-trace"; break;
		case LogLevel.None: logLevelClass = ""; break;
		default: throw new InvalidOperationError(`Unexpected log level "${args.logLevel}"`);
	}

	return <div className={`log ${logLevelClass}`}>
		<pre>{args.message}</pre>
	</div>
}

export interface LogArgs
{
	logLevel: LogLevel;
	message: string;
}
