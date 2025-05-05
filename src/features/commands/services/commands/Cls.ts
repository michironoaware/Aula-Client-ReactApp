import { Command } from "lib/commands/Command.ts";
import { events } from "lib/events.ts";

export class Cls extends Command
{
	public get name()
	{
		return "cls";
	}

	public get description()
	{
		return "Clear the console.";
	}

	public async callback()
	{
		await events.emit("LogClearRequest");
	}
}
