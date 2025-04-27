import { ReactNode, useEffect, useState } from "react";
import { events } from "../Services/events";
import { LocalStorageFacade } from "../Services/LocalStorageFacade";
import { loggers } from "../Services/loggers";
import { ILogger, LogLevel } from "../Common/Logging";
import Log from "./Log.tsx";
import { IGatewayClientEvents, Message } from "aula.js";
import { gatewayClient } from "../Services/gatewayClient.ts";
import AulaMessageLog from "./AulaMessageLog.tsx";
import { Delay } from "../Common/Delay.ts";

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
					key: `l${previousLogs.length + 1}`
				} ]);
			}
		} satisfies ILogger;
		loggers.add(logger);

		const aulaMessageReceiver: IGatewayClientEvents["MessageCreated"] = (event) =>
			setLogs(prev => [ ...prev, {
				type: LogDataType.AulaMessage,
				logLevel: LogLevel.Information,
				message: event.message,
				key: event.message.id
			} ]);
		gatewayClient.on("MessageCreated", aulaMessageReceiver);
		const aulaMessageRemover: IGatewayClientEvents["MessageRemoved"] = (event) =>
			setLogs(prev => prev.toSpliced(prev.findIndex(v => v.key === event.messageId), 1));
		gatewayClient.on("MessageRemoved", aulaMessageRemover);

		const logCleaner = () => setLogs([]);
		events.on("LogClearRequest", logCleaner);

		return () =>
		{
			loggers.remove(logger);
			events.remove("LogClearRequest", logCleaner);
			gatewayClient.remove("MessageCreated", aulaMessageReceiver);
			gatewayClient.remove("MessageRemoved", aulaMessageRemover);
		}
	}, []);

	useEffect(() =>
	{
		const logWelcomeMessages = async () =>
		{
			// TODO: Add (first time/welcome/configuration required) messages.

			if (!gatewayClient.hasToken)
			{
				await Delay(1000);
				loggers.log(LogLevel.Information, "You are not logged in.");
				await Delay(2500);
				loggers.log(LogLevel.Information, `New here? Type "help register" to see how to create an account.`);
			} else
			{
				const currentUser = await gatewayClient.rest.getCurrentUser();
				loggers.log(LogLevel.Information, `Logged in as ${currentUser.displayName}`);

				const currentRoom = await currentUser.getCurrentRoom();
				if (currentRoom)
				{
					loggers.log(LogLevel.Information, `You woke up in ${currentRoom?.name}`);
					if (currentRoom.description.length > 0)
					{
						loggers.log(LogLevel.Information, currentRoom.description);
					}

					const usersNearby = (await currentRoom.getUsers()).filter(u => u.id !== currentUser.id);
					if (usersNearby.length > 0)
						loggers.log(LogLevel.Information, `Presences nearby: ${usersNearby.map(u => u.displayName).join(", ")}.`);
				}
			}
		}

		logWelcomeMessages();
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
	logLevel: LogLevel.Information;
	message: Message;
}

enum LogDataType
{
	Console,
	AulaMessage
}
