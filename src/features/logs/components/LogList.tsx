import { ReactNode, useEffect, useState } from "react";
import { LocalStorageFacade } from "lib/LocalStorageFacade.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";
import { ILogger } from "utils/logging/ILogger.ts";
import { logging } from "lib/logging.ts";
import { IGatewayClientEvents, Message } from "aula.js";
import { aula } from "lib/aula.ts";
import { events } from "lib/events.ts";
import Log from "./Log.tsx";
import AulaMessageLog from "./AulaMessageLog.tsx";

export default function LogList(args: LogListArgs)
{
	const [ logs, setLogs ] = useState<LogData[]>([]);

	useEffect(() =>
	{
		const logger = {
			log: (logLevel, message) =>
			{
				const selectedLogLevel = LocalStorageFacade.logLevel ?? LogLevel.Information;
				if (logLevel < selectedLogLevel)
					return;

				setLogs(previousLogs => [ ...previousLogs, {
					type: LogDataType.Console,
					logLevel,
					message,
					key: `l${previousLogs.length + 1}d${Date.now()}`
				} ]);
			}
		} satisfies ILogger;
		logging.add(logger);

		const aulaMessageReceiver: IGatewayClientEvents["MessageCreated"] = (event) =>
			setLogs(prev => [ ...prev, {
				type: LogDataType.AulaMessage,
				message: event.message,
				key: event.message.id
			} ]);
		aula.gateway.on("MessageCreated", aulaMessageReceiver);

		const aulaMessageRemover: IGatewayClientEvents["MessageRemoved"] = (event) =>
			setLogs(prev => prev.toSpliced(prev.findIndex(v => v.key === event.messageId), 1));
		aula.gateway.on("MessageRemoved", aulaMessageRemover);

		const logCleaner = () => setLogs([]);
		events.on("LogClearRequest", logCleaner);

		return () =>
		{
			logging.remove(logger);
			events.remove("LogClearRequest", logCleaner);
			aula.gateway.remove("MessageCreated", aulaMessageReceiver);
			aula.gateway.remove("MessageRemoved", aulaMessageRemover);
		}
	}, []);

	return <div className="loglist">
		{args.children}
		{logs.map(log =>
		{
			if (log.type === LogDataType.Console)
				return <Log key={log.key} logLevel={log.logLevel} message={log.message}/>;
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
	key: string;
	logLevel: LogLevel;
	message: string;
}

interface AulaMessageLogData
{
	type: LogDataType.AulaMessage;
	key: string;
	message: Message;
}

enum LogDataType
{
	Console,
	AulaMessage
}
