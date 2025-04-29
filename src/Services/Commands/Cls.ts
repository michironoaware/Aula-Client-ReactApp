import { events } from "../events";
import { Command } from "../../Commands";

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
