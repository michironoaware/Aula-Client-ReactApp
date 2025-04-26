import { ReactNode, useEffect, useState } from "react";
import { events } from "../Services/events";
import { LocalStorageFacade } from "../Services/LocalStorageFacade";
import { loggers } from "../Services/loggers";
import { ILogger, LogLevel } from "../Common/Logging";
import Log from "./Log.tsx";

export default function LogList(args: LogListArgs)
{
	const [logs, setLogs] = useState<LogData[]>([]);

	useEffect(() =>
	{
		const logger = {
			log: (level, message) =>
			{
				const selectedLogLevel = LocalStorageFacade.logLevel ?? LogLevel.Information;
				if (level < selectedLogLevel)
					return;

				setLogs(previousLogs => [...previousLogs, { level, message }]);
			}
		} satisfies ILogger;
		loggers.add(logger);

		const logCleaner = () => setLogs([]);
		events.on("LogClearRequest", logCleaner);

		return () =>
		{
			loggers.remove(logger);
			events.remove("LogClearRequest", logCleaner);
		}
	}, []);

	return <div className="loglist">
		{args.children}
		{logs.map(l => <Log logLevel={l.level} message={l.message}/>)}
	</div>
}

export interface LogListArgs
{
	children?: ReactNode
}

interface LogData
{
	level: LogLevel;
	message: string;
}
