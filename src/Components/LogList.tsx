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
				setLogs([...logs, { level, message, generatedKey: crypto.randomUUID() }]);
			}
		} satisfies ILogger;
		loggers.add(logger);

		return () => loggers.remove(logger);
	}, [logs, setLogs]);

	return <div className="loglist">
		{args.children}
		{logs.map(l => <Log key={l.generatedKey} logLevel={l.level} message={l.message}/>)}
	</div>
}

export interface LogListArgs
{
	children?: ReactNode
}

interface LogData
{
	generatedKey: string;
	level: LogLevel;
	message: string;
}
