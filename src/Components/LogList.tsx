import { ReactNode, useEffect, useState } from "react";
import { events } from "../Services/events";
import { LocalStorageFacade } from "../Services/LocalStorageFacade";
import { ILogger, LogLevel } from "../Common/Logging";
import Log from "./Log.tsx";
import { IGatewayClientEvents, Message, Room } from "aula.js";
import AulaMessageLog from "./AulaMessageLog.tsx";
import { Delay } from "../Common/Delay.ts";
import { aula } from "../Services/aula.ts";
import { logging } from "../Services/logging.ts";

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
				logLevel: LogLevel.Information,
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

	useEffect(() =>
	{
		const logWelcomeMessages = async () =>
		{
			// TODO: Add (first time/welcome/configuration required) messages.

			if (!aula.gateway.hasToken)
			{
				await Delay(1000);
				logging.log(LogLevel.Information, "You are not logged in.");
				await Delay(3000);
				logging.log(LogLevel.Information, `New here? Type "hello-world" to get started.`);
			} else
			{
				const currentUser = await aula.rest.getCurrentUser();
				logging.log(LogLevel.Information, `Logged in as ${currentUser.displayName}`);

				const currentRoom = currentUser.currentRoomId ?
					aula.rest.cache?.get(currentUser.currentRoomId) as Room | undefined ?? await currentUser.getCurrentRoom()
					: null;
				if (currentRoom)
				{
					logging.log(LogLevel.Information, `You woke up in ${currentRoom?.name}`);
					if (currentRoom.description.length > 0)
					{
						logging.log(LogLevel.Information, currentRoom.description);
					}

					const usersNearby = (await currentRoom.getUsers()).filter(u => u.id !== currentUser.id);
					if (usersNearby.length > 0)
						logging.log(LogLevel.Information, `Presences nearby: ${usersNearby.map(u => u.displayName).join(", ")}.`);
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
