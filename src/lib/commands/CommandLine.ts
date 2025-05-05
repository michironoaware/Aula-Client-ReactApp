import { Command } from "lib/commands/Command.ts";
import { ILogger } from "utils/logging/ILogger.ts";
import { CancellationToken, ReadonlyDictionary, UnreachableError } from "aula.js";
import { StringHelper } from "utils/StringHelper.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";
import { ArrayHelper } from "utils/ArrayHelper.ts";
import { CommandOption } from "lib/commands/CommandOption.ts";

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

	public removeCommand(command: Command)
	{
		this.#_commands.delete(command.name);
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
		if (StringHelper.isNullOrWhiteSpace(input))
			return false;

		const inputSegments = input.split(" ");
		if (StringHelper.isNullOrWhiteSpace(input))
			return false;

		const commandName = inputSegments.shift()!;
		const command = this.#_commands.get(commandName);
		if (command === undefined)
		{
			this.#_logger.log(LogLevel.Error, `Unknown command "${commandName}"`);
			return false;
		}

		const pendingOptions = ArrayHelper
			.asArray(command.options.values())
			.filter(opt => opt.isRequired);
		const args: Map<string, string> = new Map();

		while (inputSegments.length > 0)
		{
			let segment = inputSegments.shift()!;
			if (StringHelper.isNullOrWhiteSpace(segment))
			{
				continue;
			}

			const startsWithParameterPrefix = segment.startsWith(CommandOption.prefix);
			if (!startsWithParameterPrefix &&
			    command.subCommands.size !== 0)
			{
				// Should be a subcommand
				return await this.#processCommand([ segment, ...inputSegments ].join(" "), cancellationToken);
			}

			let option: CommandOption | undefined;
			if (startsWithParameterPrefix)
			{
				const optionName = segment.slice(CommandOption.prefix.length);
				option = command.options.get(optionName);
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

				segment = inputSegments.shift()!;
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
					this.#_logger.log(LogLevel.Error, `Impossible to infer which option to fill in, please specify.`);
					return false;
				}
			}

			if (option === undefined)
				throw new UnreachableError("Option should not be undefined at this point");

			args.set(option.name, option.canOverflow ? [ segment, ...inputSegments ].join(" ") : segment);
			pendingOptions.splice(pendingOptions.indexOf(option), 1);
		}

		if (pendingOptions.length > 0)
		{
			const optionNames = pendingOptions
				.map(o => `"${o.name}"`)
				.join(", ");

			const logMessage = pendingOptions.length > 1
				? `options ${optionNames} are required but they were not provided.`
				: `option ${optionNames} is required but was not provided.`;
			this.#_logger.log(LogLevel.Error, logMessage);
			return false;
		}

		await command.callback(args, cancellationToken);
		return true;
	}
}
