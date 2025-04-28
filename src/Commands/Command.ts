import { CancellationToken, ReadonlyDictionary } from "aula.js";
import { CommandOption } from ".";

export abstract class Command
{
	readonly #_options: Map<string, CommandOption> = new Map();
	readonly #_subCommands: Map<string, Command> = new Map();
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

		this.#_options.set(option.name, option);
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
