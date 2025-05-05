import { Presence, User, UserPresenceUpdatedEvent } from "aula.js";
import { useEffect, useState } from "react";

export default function AulaPresenceUpdateLog({ props }: { props: AulaPresenceUpdateLogProps })
{
	const [ message, setMessage ] = useState<string | null>(null);
	const constructMessage = async () =>
	{
		const userId = props.event.userId;
		const presence = props.event.presence
		const client = props.event.gatewayClient;
		const user = client.rest.cache?.get(userId) as User | undefined ?? (await client.rest.getUser(userId))!;

		if (presence === Presence.Online)
			setMessage(getRandomMessage(userWakeMessages, user.displayName));
		else if (presence === Presence.Offline)
			setMessage(getRandomMessage(userSleepMessages, user.displayName));
	}

	useEffect(() =>
	{
		constructMessage().then()
	}, []);

	return <div className="log loglevel-information">
		<i><pre>{message}</pre></i>
	</div>
}

export interface AulaPresenceUpdateLogProps
{
	event: UserPresenceUpdatedEvent;
}

const userSleepMessages = [
	"{displayName} has drifted off into dreams.",
	"{displayName} vanishes into the mists of slumber.",
	"{displayName} closes their eyes and lets the world fade.",
	"{displayName} fades quietly into the twilight.",
	"{displayName} slips away into a peaceful rest."
];

const userWakeMessages = [
	"{displayName} awakens once more.",
	"{displayName} opens their eyes anew.",
	"{displayName} is back from their rest.",
	"{displayName} returns to the land of the living.",
	"{displayName} rises, present and alert."
];

function getRandomMessage(messages: string[], displayName: string)
{
	const message = messages[Math.floor(Math.random() * messages.length)];
	return message.replace("{displayName}", displayName);
}
