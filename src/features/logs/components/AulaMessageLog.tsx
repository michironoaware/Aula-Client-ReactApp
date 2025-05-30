﻿import { useEffect, useState } from "react";
import { DefaultMessage, Message, MessageFlags, Room, User, UserJoinMessage, UserLeaveMessage } from "aula.js";
import { HtmlUtility } from "utils/HtmlUtility.ts";
import { BigIntHelper } from "utils/BigIntHelper.ts";

export default function AulaMessageLog({ props }: { props: AulaMessageLogProps })
{
	const [ message, setMessage ] = useState<string | null>(null);
	useEffect(() =>
	{
		const constructMessage = async () =>
		{
			const cache = props.message.restClient.cache;

			if (props.message instanceof DefaultMessage)
			{
				let msg = HtmlUtility.getHtmlFromMarkdown(HtmlUtility.escapeHtml(props.message.text));
				const author = props.message.authorId
					? cache?.get(props.message.authorId) as User | undefined ?? await props.message.getAuthor()
					: null;
				let authorName = author?.displayName ?? "System";

				if (!BigIntHelper.HasFlag(props.message.flags, MessageFlags.HideAuthor))
				{
					const separator = msg.startsWith("<em>") ? " ":": ";
					msg = `${authorName}${separator}${msg}`;
				}
				else
				{
					msg = `${msg}${msg.endsWith(".") ? " " : "."}<div class="sentbytext">Sent by ${authorName}.</div>`;
				}

				setMessage(() => msg);

			} else if (props.message instanceof UserJoinMessage)
			{
				const user = cache?.get(props.message.userJoin.userId) as User | undefined ?? await props.message.userJoin.getUser();
				const previousRoom = props.message.userJoin.previousRoomId
					? cache?.get(props.message.userJoin.previousRoomId) as Room | undefined
					?? await props.message.userJoin.getPreviousRoom()
					: null;
				setMessage(() => `<i>${getJoinMessage(props.message.id, user.displayName, previousRoom?.id)}</i>`);
			} else if (props.message instanceof UserLeaveMessage)
			{
				const user = cache?.get(props.message.userLeave.userId) as User | undefined ?? await props.message.userLeave.getUser();
				const room = props.message.userLeave.nextRoomId
					? cache?.get(props.message.userLeave.nextRoomId) as Room | undefined
					?? await props.message.userLeave.getRoom()
					: null;
				setMessage(() => `<i>${getLeaveMessage(props.message.id, user.displayName, room?.id)}</i>`)
			} else
			{
				setMessage(() => "Received message of an unknown type.");
			}

			return () =>
			{
			};
		}

		constructMessage().then();
	}, []);


	return <div className="log loglevel-information">
		<pre dangerouslySetInnerHTML={{ __html: message! }}></pre>
	</div>
}

export interface AulaMessageLogProps
{
	message: Message;
}

const userJoinWithoutPreviousRoomMessages = [
	"{displayName} has arrived from afar!",
	"{displayName} emerges from distant lands.",
	"{displayName} journeys in from beyond the horizon.",
	"{displayName} steps forth from a faraway realm.",
	"{displayName} comes wandering from distant shores."
];

const userJoinWithPreviousRoomMessages = [
	"{displayName} has arrived from the distant realms of {previousRoomName}!",
	"{displayName} emerges from the far-off lands of {previousRoomName}.",
	"{displayName} journeys in from {previousRoomName}, beyond the horizon.",
	"{displayName} steps forth from the mysterious domain of {previousRoomName}.",
	"{displayName} comes wandering all the way from {previousRoomName}."
];

function getJoinMessage(messageId: string, displayName: string, previousRoomName?: string)
{
	if (previousRoomName === undefined)
	{
		const index = Number(BigIntHelper.RangeHash(BigInt(messageId), 0n, BigInt(userJoinWithoutPreviousRoomMessages.length - 1)));
		const messageTemplate = userJoinWithoutPreviousRoomMessages[index];
		return messageTemplate.replace("{displayName}", displayName);
	}

	const index = Number(BigIntHelper.RangeHash(BigInt(messageId), 0n, BigInt(userJoinWithPreviousRoomMessages.length - 1)));
	const messageTemplate = userJoinWithPreviousRoomMessages[index];
	return messageTemplate
			.replace("{displayName}", displayName)
			.replace("{previousRoomName}", previousRoomName);
}

const userLeaveWithoutNextRoomMessages = [
	"{displayName} has vanished into the unknown!",
	"{displayName} departs toward distant horizons.",
	"{displayName} fades away beyond the veil.",
	"{displayName} steps into realms unseen.",
	"{displayName} journeys onward to faraway places."
];

const userLeaveWithNextRoomMessages = [
	"{displayName} sets off toward the lands of {nextRoomName}!",
	"{displayName} journeys forth to {nextRoomName}.",
	"{displayName} disappears beyond the mists, heading for {nextRoomName}.",
	"{displayName} departs in search of {nextRoomName}.",
	"{displayName} steps into the path toward {nextRoomName}."
];

function getLeaveMessage(messageId: string, displayName: string, nextRoomName?: string)
{
	if (nextRoomName === undefined)
	{
		const index = Number(BigIntHelper.RangeHash(BigInt(messageId), 0n, BigInt(userLeaveWithoutNextRoomMessages.length - 1)));
		const messageTemplate = userLeaveWithoutNextRoomMessages[index];
		return messageTemplate.replace("{displayName}", displayName);
	}

	const index = Number(BigIntHelper.RangeHash(BigInt(messageId), 0n, BigInt(userLeaveWithNextRoomMessages.length - 1)));
	const messageTemplate = userLeaveWithNextRoomMessages[index];
	return messageTemplate
			.replace("{displayName}", displayName)
			.replace("{nextRoomName}", nextRoomName);
}
