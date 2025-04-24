import { CancellationToken, ReadonlyDictionary, UnreachableError } from "aula.js-alpha";
import { Command, CommandOption } from ".";
import { ILogger, LogLevel } from "../Common/Logging";

export class CommandLine
{
	readonly #_commands: Map<string, Command> = new Map();
	#_logger: ILogger;
	#_commandsView: ReadonlyDictionary<string, Command> | null = null;

	public constructor(logger: ILogger)
	{
		this.#_logger = logger;
	}

	public get commands()
	{
		return this.#_commandsView ??= new ReadonlyDictionary(this.#_commands);
	}

	public addCommand(command: Command): void
	{
		if (this.#_commands.has(command.name))
			throw new Error(`Command name already registered: '${command.name}'.`);

		this.#_commands.set(command.name, command);
	}

	public async processCommand(
		input: string,
		cancellationToken: CancellationToken = CancellationToken.none
	)
	{
		return this.#processCommand(input.trim(), cancellationToken);
	}

	public setLogger(logger: ILogger)
	{
		this.#_logger = logger;
	}

	async #processCommand(
		input: string,
		cancellationToken: CancellationToken
	): Promise<boolean>
	{
		if (input.length === 0 || input.trim().length === 0)
			return false;

		const inputSegments = input.split(" ");
		if (inputSegments.length === 0)
			return false;

		const commandName = inputSegments.shift()!;
		const command = this.#_commands.get(commandName);
		if (command === undefined)
		{
			this.#_logger.log(LogLevel.Error, `Unknown command "${commandName}"`);
			return false;
		}

		const pendingOptions = [...command.options]
			.map(o => o[1])
			.filter(opt => opt.isRequired);
		const args: Map<string, string> = new Map();

		while (inputSegments.length > 0)
		{
			const segment = inputSegments.shift()!;
			if (segment.length === 0 || input.trim().length === 0)
			{
				continue;
			}

			const startsWithParameterPrefix = segment.startsWith(CommandOption.prefix);
			if (startsWithParameterPrefix &&
			    command.subCommands.size !== 0)
			{
				// Should be a subcommand
				return await this.#processCommand([ segment, ...inputSegments ].join(" "), cancellationToken);
			}

			let option: CommandOption | undefined;
			if (startsWithParameterPrefix)
			{
				const optionName = segment.slice(CommandOption.prefix.length);
				const option = command.options.get(optionName);
				if (option === undefined)
				{
					this.#_logger.log(LogLevel.Error, `Invalid command option name "${commandName}"`);
					return false;
				}

				if (!option.requiresArgument)
				{
					args.set(optionName, "");
					pendingOptions.splice(pendingOptions.indexOf(option), 1);
					continue;
				}

				if (inputSegments.length === 0)
				{
					this.#_logger.log(LogLevel.Error, `The option "${optionName}" requires to provide a value.`);
					return false;
				}
			}

			if (option === undefined)
			{
				if (command.options.size === 1)
				{
					// If a command has no subcommands, only one option, and no option is provided,
					// then that option is automatically selected.
					option = command.options.values().next().value;
				}
				else
				{
					// The command multiple options, and we cannot guess which select.
					// returns the same response for unrecognized subcommands.
					this.#_logger.log(LogLevel.Error, `Unknown command "${commandName}"`);
					return false;
				}
			}

			if (option === undefined)
				throw new UnreachableError("Option should not be undefined at this point");

			args.set(option!.name, option!.canOverflow ? [ segment, ...inputSegments ].join(" ") : segment);
			pendingOptions.splice(pendingOptions.indexOf(option!), 1);
		}

		if (pendingOptions.length > 0)
		{
			const optionNames = pendingOptions
				.map(o => `"${o.name}"`)
				.join(", ");
			this.#_logger.log(LogLevel.Error, `options ${optionNames} are required but they were not provided.`)
			return false;
		}

		await command.callback(args, cancellationToken);
		return true;
	}
}
