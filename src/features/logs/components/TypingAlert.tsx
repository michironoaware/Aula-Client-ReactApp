import React, { useEffect } from "react";
import { aula } from "lib/aula";
import "../styles/TypingAlert.css";
import { IGatewayClientEvents, User } from "aula.js";

export default function TypingAlert()
{
	const classNames = [ "typing-alert" ];
	const [ usersTyping, setUsersTyping ] = React.useState<ITypingUser[]>([]);

	if (usersTyping.length > 0)
		classNames.push("active");

	let text: string;
	if (usersTyping.length === 0)
		text = "";
	else if (usersTyping.length === 1)
		text = `${usersTyping[0].displayName} is typing...`;
	else if (usersTyping.length === 2)
		text = `${usersTyping[0].displayName} and ${usersTyping[1].displayName} are typing...`;
	else
		text = "Multiple users are typing...";

	useEffect(() =>
	{
		const aulaOnUserCurrentRoomUpdated: IGatewayClientEvents["UserCurrentRoomUpdated"] = (event) =>
		{
			if (event.userId === aula.gateway.currentUser!.id)
				setUsersTyping(prev => []);
		};

		const aulaOnUserStartedTyping: IGatewayClientEvents["UserStartedTyping"] = async (event) =>
		{
			if (event.roomId !== aula.gateway.currentUser!.currentRoomId)
				return;

			const userTyping = aula.rest.cache?.get(event.userId) as User | undefined
				?? await aula.rest.getUser(event.userId) as User;

			setUsersTyping(prev =>
			{
				if (prev.find(u => u.id === event.userId))
					return prev;

				const next = [ ...prev, userTyping ];
				setTimeout(() =>
				{
					setUsersTyping(prev =>
					{
						const next2 = [ ...prev ];
						next2.splice(next2.findIndex(u => u.id === event.userId), 1);
						return next2;
					});
				}, 10000);

				return next;
			})
		};

		const aulaOnMessageCreated: IGatewayClientEvents["MessageCreated"] = (event) =>
		{
			if (event.message.roomId !== aula.gateway.currentUser!.currentRoomId)
				return;

			setUsersTyping(prev =>
			{
				const userTyping = prev.find(u => u.id === event.message.authorId);
				if (!userTyping)
					return prev;

				const next = [ ...prev ];
				next.splice(next.indexOf(userTyping), 1);
				return next;
			});
		}

		aula.gateway.on("UserCurrentRoomUpdated", aulaOnUserCurrentRoomUpdated);
		aula.gateway.on("UserStartedTyping", aulaOnUserStartedTyping);

		return () =>
		{
			aula.gateway.remove("UserCurrentRoomUpdated", aulaOnUserCurrentRoomUpdated);
			aula.gateway.remove("UserStartedTyping", aulaOnUserStartedTyping);
		}
	}, []);

	return <div className={classNames.join(" ")}>{text}</div>
}

interface ITypingUser
{
	id: string;
	displayName: string;
}
