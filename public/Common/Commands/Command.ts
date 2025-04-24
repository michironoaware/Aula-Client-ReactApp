import { CancellationToken, ReadonlyDictionary } from "aula.js-alpha";
import { CommandOption } from ".";

export abstract class Command
{
	readonly #_options: Map<string, CommandOption> = new Map();
	readonly #_subCommands: Map<string, Command> = new Map();
	#_previousDefinedOption: CommandOption | null = null;
	#_optionsView: ReadonlyDictionary<string, CommandOption> | null = null;
	#_subCommandsView: ReadonlyDictionary<string, Command> | null = null;

	public abstract get name(): string;

	public abstract get description(): string;

	public get options()
	{
		return this.#_optionsView ??= new ReadonlyDictionary(this.#_options);
	}

	public get subCommands()
	{
		return this.#_subCommandsView ??= new ReadonlyDictionary(this.#_subCommands);
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken): Promise<void>
	{
		// Default no-op
	}

	protected addOption(option: CommandOption): void
	{
		if (this.#_options.has(option.name))
		{
			throw new Error(`Duplicate command option name: '${option.name}'.`);
		}

		if (this.#_previousDefinedOption)
		{
			if (option.isRequired && !this.#_previousDefinedOption.isRequired)
			{
				throw new Error(
					`An optional option cannot precede a required one. '${this.#_previousDefinedOption.name}' is optional but '${option.name}' is required.`
				);
			}
			if (this.#_previousDefinedOption.canOverflow)
			{
				throw new Error(
					`The option '${this.#_previousDefinedOption.name}' is marked for overflow, but is followed by another option.`
				);
			}
		}

		this.#_options.set(option.name, option);
		this.#_previousDefinedOption = option;
	}

	protected addOptions(...options: CommandOption[]): void
	{
		for (const option of options)
		{
			this.addOption(option);
		}
	}

	protected addSubCommand(subCommand: Command): void
	{
		if (this.#_subCommands.has(subCommand.name))
		{
			throw new Error(`A subcommand with the name '${subCommand.name}' has already been registered.`);
		}
		this.#_subCommands.set(subCommand.name, subCommand);
	}
}
