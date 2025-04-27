import { ReactNode, useEffect, useState } from "react";
import { events } from "../Services/events";
import { LocalStorageFacade } from "../Services/LocalStorageFacade";
import { loggers } from "../Services/loggers";
import { ILogger, LogLevel } from "../Common/Logging";
import Log from "./Log.tsx";
import { IGatewayClientEvents, Message } from "aula.js";
import { aulaClient } from "../Services/aulaClient.ts";
import AulaMessageLog from "./AulaMessageLog.tsx";

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

				setLogs(previousLogs => [...previousLogs, {
					type: LogDataType.Console,
					level,
					message,
					id: `l${previousLogs.length + 1}`
				}]);
			}
		} satisfies ILogger;
		loggers.add(logger);

		const aulaMessageReceiver: IGatewayClientEvents["MessageCreated"] = (event) =>
			setLogs(prev => [...prev, {
				type: LogDataType.AulaMessage,
				level: LogLevel.Information,
				message: event.message,
				id: event.message.id
			}]);
		aulaClient.on("MessageCreated", aulaMessageReceiver);
		const aulaMessageRemover: IGatewayClientEvents["MessageRemoved"] = (event) =>
			setLogs(prev => prev.toSpliced(prev.findIndex(v => v.id === event.messageId), 1));
		aulaClient.on("MessageRemoved", aulaMessageRemover);

		const logCleaner = () => setLogs([]);
		events.on("LogClearRequest", logCleaner);

		return () =>
		{
			loggers.remove(logger);
			events.remove("LogClearRequest", logCleaner);
			aulaClient.remove("MessageCreated", aulaMessageReceiver);
			aulaClient.remove("MessageRemoved", aulaMessageRemover);
		}
	}, []);

	return <div className="loglist">
		{args.children}
		{logs.map(log =>
		{
			if (log.type === LogDataType.Console)
				return <Log key={log.id} logLevel={log.level} message={log.message}/>;
			if (log.type === LogDataType.AulaMessage)
				return <AulaMessageLog props={{ message: log.message }}></AulaMessageLog>;
		})}
	</div>
}

export interface LogListArgs
{
	children?: ReactNode
}

type LogData = ConsoleLogData | AulaMessageLogData;

interface ConsoleLogData
{
	type: LogDataType.Console;
	id: string;
	level: LogLevel;
	message: string;
}

interface AulaMessageLogData
{
	type: LogDataType.AulaMessage;
	id: string;
	level: LogLevel.Information;
	message: Message;
}

enum LogDataType
{
	Console,
	AulaMessage
}
