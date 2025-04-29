import { gatewayClient } from "../gatewayClient.ts";

let lastSessionId: string | undefined;
let connected = false;
let tryReconnect = false;

gatewayClient.on("Ready", event =>
{
	connected = true;
	lastSessionId = event.sessionId;
});

gatewayClient.on("Resumed", () =>
{
	connected = true;
});

gatewayClient.on("Disconnected", async () =>
{
	connected = false;
	while (!connected)
	{
		try
		{
			if (tryReconnect)
				return;
			await gatewayClient.connect(lastSessionId);
		}
		catch (err)
		{
			console.error(err);
		}
	}
});

export async function connect()
{
	tryReconnect = true;
	await gatewayClient.connect();
}

export async function disconnect()
{
	tryReconnect = false;
	await gatewayClient.disconnect();
}
