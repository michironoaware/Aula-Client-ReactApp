import { ReactNode, useEffect, useState } from "react";
import { loggers } from "../Services";
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
				setLogs(previousLogs => [...previousLogs, { level, message }]);
			}
		} satisfies ILogger;
		loggers.add(logger);

		return () => loggers.remove(logger);
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
