import { Command } from "../../../../lib/commands/Command.ts";
import { CommandOption } from "../../../../lib/commands/CommandOption.ts";
import { aula } from "lib/aula.ts";
import { CancellationToken, Room, SetUserRoomRequestBody } from "aula.js";
import { logging } from "../../../../lib/logging.ts";
import { LogLevel } from "../../../../utils/logging/LogLevel.ts";
import { StringBuilder } from "../../../../utils/StringBuilder.ts";
import { RestHelper } from "../../../../lib/RestHelper.ts";
import { ErrorHelper } from "../../../../utils/ErrorHelper.ts";

export class Move extends Command
{
	static readonly #s_roomNameOption = new CommandOption({
		name: "n",
		description: "The name of the room to go to.",
		isRequired: false,
		requiresArgument: true,
		canOverflow: true,
	});

	public constructor()
	{
		super();
		this.addOption(Move.#s_roomNameOption);
	}

	public get name()
	{
		return "move";
	}

	public get description()
	{
		return "Move you from one room to another.";
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken): Promise<void>
	{
		const roomName = args.get(Move.#s_roomNameOption.name);
		const currentRoom = aula.gateway.currentUser!.currentRoomId
			? aula.rest.cache?.get(aula.gateway.currentUser!.currentRoomId) as Room | undefined
			?? await aula.gateway.currentUser!.getCurrentRoom()
			:null;

		if (!roomName)
		{

			let adjacentRooms: Room[] = [];
			if (!currentRoom)
			{
				const allRooms = await RestHelper.getAllRooms(aula.rest, cancellationToken);
				adjacentRooms.push(...allRooms.filter(r => r.isEntrance));
			} else
			{
				for (const roomId of currentRoom.connectedRoomIds)
				{
					const room = aula.rest.cache?.get(roomId) as Room | undefined
						?? (await aula.rest.getRoomConnections(currentRoom.id, cancellationToken)).find(r => r.id === roomId);
					if (!room)
						continue;
					adjacentRooms.push(room);
				}
			}

			const adjacentRoomsText = new StringBuilder();
			for (const room of adjacentRooms)
			{
				adjacentRoomsText.appendLine(room.name);
			}

			logging.log(LogLevel.Information, "Here's a list of all available rooms you can move to:");
			logging.log(LogLevel.Information, adjacentRoomsText.toString());
			return;
		}

		if (ErrorHelper.Try(() => BigInt(roomName)))
		{
			await aula.rest.setCurrentUserRoom(new SetUserRoomRequestBody().withRoomId(roomName), cancellationToken);
			return;
		}

		if (!currentRoom)
		{
			const allRooms = await RestHelper.getAllRooms(aula.rest, cancellationToken);
			for (const room of allRooms)
			{
				if (room.name.includes(roomName))
				{
					await aula.rest.setCurrentUserRoom(new SetUserRoomRequestBody().withRoomId(room.id), cancellationToken);
					break;
				}
			}

			return;
		}

		for (const roomId of currentRoom.connectedRoomIds)
		{
			const room = aula.rest.cache?.get(roomId) as Room | undefined
				?? (await aula.rest.getRoomConnections(currentRoom.id, cancellationToken)).find(r => r.id === roomId);
			if (!room)
				continue;

			if (room.name.includes(roomName))
			{
				await aula.rest.setCurrentUserRoom(new SetUserRoomRequestBody().withRoomId(room.id), cancellationToken);
				return;
			}
		}

		logging.log(LogLevel.Error, "No room with that name was found.");
	}
}
