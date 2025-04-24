import { Command, CommandOption } from "../../Commands";
import { ThemeType } from "../../Components/ThemeType.tsx";
import { CancellationToken } from "aula.js";
import { StringHelper } from "../../Common";
import { events, loggers } from "../../Services";
import { LogLevel } from "../../Common/Logging";

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
	})

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
		return "Sets the theme for the interface";
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken)
	{
		const themeString = StringHelper.capitalize(args.get(SetTheme.#s_themeOption.name)!.toLowerCase());
		if (!isNaN(Number(themeString)))
		{
			loggers.log(LogLevel.Error, "The theme specified is invalid.");
			return;
		}

		// Doing the casts to take advantage of enum's implementation
		// by passing the enum's member name instead of the enum value,
		// so we can get the enum value.
		const theme = ThemeType[themeString as any] as unknown as ThemeType | undefined;
		if (theme === undefined)
		{
			loggers.log(LogLevel.Error, "The theme specified is invalid.");
			return;
		}

		await events.emit("ThemeUpdateRequest", theme);
		loggers.log(LogLevel.Information, `Theme set to "${themeString}" successfully!`);
	}
}
