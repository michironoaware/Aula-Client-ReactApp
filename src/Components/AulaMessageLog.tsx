import { Message, MessageFlags, StandardMessage, UserJoinMessage, UserLeaveMessage } from "aula.js";
import { BigIntHelper } from "../Common/BigIntHelper.ts";
import { HtmlUtility } from "../Common/HtmlUtility.ts";
import { ReactNode, useEffect, useState } from "react";

export default function AulaMessageLog({ props }: { props: AulaMessageLogProps })
{
    const [message, setMessage] = useState<string | null>(null);
	useEffect(() =>
	{
		const constructMessage = async () =>
		{
			if (props.message instanceof StandardMessage)
			{
				let msg = HtmlUtility.getHtmlFromMarkdown(HtmlUtility.escapeHtml(props.message.text));

				if (!BigIntHelper.HasFlag(props.message.flags, MessageFlags.HideAuthor))
				{
					const author = await props.message.getAuthor();
					const authorName = author?.displayName ?? "System";
					const separator = msg.startsWith("<em>") ? " " : ": ";
					msg = `${authorName}${separator}${msg}`;
				}

				setMessage(() => msg);

			} else if (props.message instanceof UserJoinMessage)
			{
				const user = await props.message.userJoin.getUser();
				const previousRoom = await props.message.userJoin.getPreviousRoom();
				setMessage(() => `<i>${getJoinMessage(props.message.id, user.displayName, previousRoom?.id)}</i>`);
			} else if (props.message instanceof UserLeaveMessage)
			{
				const user = await props.message.userLeave.getUser();
				const room = await props.message.userLeave.getRoom();
				setMessage(() => `<i>${getLeaveMessage(props.message.id, user.displayName, room?.id)}</i>`)
			} else
			{
				setMessage(() => "Received message of an unknown type.");
			}

			return () => {};
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
