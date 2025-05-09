import { CancellationToken, GetRoomsQuery, RestClient, Room } from "aula.js";

export namespace RestHelper
{
	export async function getAllRooms(rest: RestClient, cancellationToken: CancellationToken)
	{
		const allRooms: Room[] = [];
		let lastRoomId: string | null = null;
		let pageIsFull: boolean;
		do
		{
			const roomPage = await rest.getRooms(new GetRoomsQuery()
				.withCount(100)
				.withAfter(lastRoomId), cancellationToken);

			roomPage.sort((r1, r2) => r1.creationDate.getUTCMilliseconds() - r2.creationDate.getUTCMilliseconds());
			allRooms.push(...roomPage);
			lastRoomId = roomPage[roomPage.length - 1].id;
			pageIsFull = roomPage.length > 100;
		} while (pageIsFull);

		return allRooms;
	}
}
