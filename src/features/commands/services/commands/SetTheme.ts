﻿import { Command } from "lib/commands/Command.ts";
import { CommandOption } from "lib/commands/CommandOption.ts";
import { ThemeType } from "components/ThemeType.ts";
import { CancellationToken } from "aula.js";
import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";
import { events } from "lib/events.ts";

export class SetTheme extends Command
{
	static readonly #s_themeOption = new CommandOption({
		name: "t",
		description: `The name of the theme. Valid options are ${Object
			.values(ThemeType)
			.filter(v => typeof v === "string")
			.map(t => `"${t}"`)
			.join(", ")}.`,
		isRequired: true,
		requiresArgument: true,
		canOverflow: false,
	});

	public constructor()
	{
		super();
		this.addOption(SetTheme.#s_themeOption);
	}

	public get name()
	{
		return "set-theme";
	}

	public get description()
	{
		return "Sets the theme for the interface.";
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken)
	{
		const themeString = args.get(SetTheme.#s_themeOption.name)!;
		if (!isNaN(Number(themeString)))
		{
			logging.log(LogLevel.Error, "The theme specified is invalid.");
			return;
		}

		const themeEntry = Object
			.entries(ThemeType)
			.find(v => v[0].toLowerCase() === themeString.toLowerCase());
		if (themeEntry === undefined)
		{
			logging.log(LogLevel.Error, "The theme specified is invalid.");
			return;
		}

		await events.emit("ThemeUpdateRequest", themeEntry[1] as ThemeType);
		logging.log(LogLevel.Information, `Theme set to "${themeEntry[0]}" successfully!`);
	}
}
