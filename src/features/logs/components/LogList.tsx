import { ReactNode, useEffect, useState } from "react";
import { LocalStorageFacade } from "lib/LocalStorageFacade.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";
import { ILogger } from "utils/logging/ILogger.ts";
import { logging } from "lib/logging.ts";
import { GetRoomsQuery, IGatewayClientEvents, Message, Presence, Room, UserPresenceUpdatedEvent } from "aula.js";
import { aula } from "lib/aula.ts";
import { events } from "lib/events.ts";
import Log from "./Log.tsx";
import AulaMessageLog from "./AulaMessageLog.tsx";
import AulaPresenceUpdateLog from "./AulaPresenceUpdateLog.tsx";

export default function LogList(args: LogListArgs)
{
	const [ logs, setLogs ] = useState<LogData[]>([]);
	const log = (logLevel: LogLevel, message: string) =>
	{
		setLogs(previousLogs => [ ...previousLogs, {
			type: LogDataType.Console,
			logLevel,
			message,
			key: `l${previousLogs.length + 1}d${Date.now()}`
		} ]);
	}

	useEffect(() =>
	{
		const logger = {
			log: (logLevel, message) =>
			{
				const selectedLogLevel = LocalStorageFacade.logLevel ?? LogLevel.Information;
				if (logLevel < selectedLogLevel)
					return;

				setLogs(prev => [ ...prev, {
					type: LogDataType.Console,
					logLevel,
					message,
					key: `l${prev.length + 1}d${Date.now()}`
				} ]);
			}
		} satisfies ILogger;

		const aulaMessageReceiver: IGatewayClientEvents["MessageCreated"] = (event) =>
		{
			setLogs(prev => [ ...prev, {
				type: LogDataType.AulaMessage,
				message: event.message,
				key: event.message.id
			} ]);
		}

		const aulaMessageRemover: IGatewayClientEvents["MessageRemoved"] = (event) =>
		{
			setLogs(prev => prev.toSpliced(prev.findIndex(v => v.key === event.messageId), 1));
		}

		const logCleaner = () => setLogs([]);

		const onAulaCurrentUserRoomUpdated: IGatewayClientEvents["UserCurrentRoomUpdated"] = async (event) =>
		{
			if (event.userId !== event.gatewayClient.currentUser!.id)
				return;

			const room = event.currentRoomId
				? event.gatewayClient.rest.cache?.get(event.currentRoomId) as Room | undefined
				?? await event.gatewayClient.rest.getRoom(event.currentRoomId)
				: null;
			if (!room)
			{
				log(LogLevel.Information, "Huh, you find yourself in a weird place.");
				return;
			}

			log(LogLevel.Information, `${room.name}\n${room.description}`);
			const nearbyPlayerNamesText = (await room.getUsers())
				.filter(u => u.id !== event.gatewayClient.currentUser!.id)
				.map(u => u.presence === Presence.Online ? u.displayName : `${u.displayName} (asleep)`)
				.join(", ");
			if (nearbyPlayerNamesText.length > 0)
				log(LogLevel.Information, `Nearby presences: ${nearbyPlayerNamesText}.`);
			else
				log(LogLevel.Information, "It's just you.");
		}

		const onAulaUserPresenceUpdated: IGatewayClientEvents["UserPresenceUpdated"] = (event) =>
		{
			if (event.userId === event.gatewayClient.currentUser!.id)
				return;

			setLogs(prev => [ ...prev, {
				type: LogDataType.AulaPresenceUpdate,
				key: `l${prev.length + 1}d${Date.now()}`,
				event,
			} ]);
		}

		const onAulaReady: IGatewayClientEvents["Ready"] = async (event) =>
		{
			log(LogLevel.Information, getRandomMessage(userWakeReturnMessages));

			const room = event.user.currentRoomId
				? event.gatewayClient.rest.cache?.get(event.user.currentRoomId) as Room | undefined
				?? await event.gatewayClient.rest.getRoom(event.user.currentRoomId)
				: null;
			if (!room)
			{
				log(LogLevel.Information, "Huh, you find yourself in a weird place.");
				return;
			}

			log(LogLevel.Information, `${room.name}\n${room.description}`);
			const nearbyPlayerNamesText = (await room.getUsers())
				.filter(u => u.id !== event.gatewayClient.currentUser!.id)
				.map(u => u.presence === Presence.Online ? u.displayName : `${u.displayName} (asleep)`)
				.join(", ");
			if (nearbyPlayerNamesText.length > 0)
				log(LogLevel.Information, `Nearby presences: ${nearbyPlayerNamesText}.`);
			else
				log(LogLevel.Information, "It's just you.");
		}

		logging.add(logger);
		events.on("LogClearRequest", logCleaner);
		aula.gateway.on("MessageCreated", aulaMessageReceiver);
		aula.gateway.on("MessageRemoved", aulaMessageRemover);
		aula.gateway.on("UserCurrentRoomUpdated", onAulaCurrentUserRoomUpdated);
		aula.gateway.on("UserPresenceUpdated", onAulaUserPresenceUpdated);
		aula.gateway.on("Ready", onAulaReady);

		return () =>
		{
			logging.remove(logger);
			events.remove("LogClearRequest", logCleaner);
			aula.gateway.remove("MessageCreated", aulaMessageReceiver);
			aula.gateway.remove("MessageRemoved", aulaMessageRemover);
			aula.gateway.remove("UserCurrentRoomUpdated", onAulaCurrentUserRoomUpdated);
			aula.gateway.remove("UserPresenceUpdated", onAulaUserPresenceUpdated);
			aula.gateway.remove("Ready", onAulaReady);
		}
	}, []);

	return <div className="loglist">
		{args.children}
		{logs.map(log =>
		{
			if (log.type === LogDataType.Console)
				return <Log key={log.key} logLevel={log.logLevel} message={log.message}/>;
			if (log.type === LogDataType.AulaMessage)
				return <AulaMessageLog key={log.key} props={{ message: log.message }}></AulaMessageLog>;
			if (log.type === LogDataType.AulaPresenceUpdate)
				return <AulaPresenceUpdateLog key={log.key} props={{ event: log.event }}></AulaPresenceUpdateLog>
		})}
	</div>
}

export interface LogListArgs
{
	children?: ReactNode
}

type LogData = ConsoleLogData | AulaMessageLogData | AulaPresenceUpdateLogData;

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

interface AulaPresenceUpdateLogData
{
	type: LogDataType.AulaPresenceUpdate;
	key: string;
	event: UserPresenceUpdatedEvent,
}

enum LogDataType
{
	Console,
	AulaMessage,
	AulaPresenceUpdate,
}

const userWakeReturnMessages = [
	"You wake up, returning to...",
	"You open your eyes and find yourself back in...",
	"You rise from sleep and reappear in...",
	"Awake once more, you return to...",
	"Sleep ends — you're back in...",
	"You stir, stretch, and return to...",
	"Conscious again, you make your way to...",
	"You blink away dreams and step back into...",
	"Your rest complete, you return to...",
];

function getRandomMessage(messages: string[])
{
	return messages[Math.floor(Math.random() * messages.length)];
}
