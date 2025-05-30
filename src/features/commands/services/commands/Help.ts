﻿import { Command } from "lib/commands/Command";
import { CommandOption } from "lib/commands/CommandOption.ts";
import { StringBuilder } from "utils/StringBuilder.ts";
import { StringHelper } from "utils/StringHelper.ts";
import { CancellationToken } from "aula.js";
import { ArrayHelper } from "utils/ArrayHelper.ts";
import { commandLine } from "../commandLine.ts";
import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";

export class Help extends Command
{
	static #s_nameOption = new CommandOption({
		name: "c",
		description: "The name of a command; If specified, shows information about the command.",
		isRequired: false,
		requiresArgument: true,
		canOverflow: true,
	});

	public constructor()
	{
		super();
		this.addOption(Help.#s_nameOption);
	}

	get name()
	{
		return "help";
	}

	get description()
	{
		return "Displays the list of available commands.";
	}

	static createSingleCommandHelpMessage(command: Command)
	{
		const message = new StringBuilder();
		const padding = 2;
		let alignment = 16;

		const parameters = new CommandParameters();

		for (const optionEntry of command.options)
		{
			const parameter = optionEntry[1];
			const name = `${CommandOption.prefix}${parameter.name}`;
			parameters.options.push(new ParameterInfo(name, parameter.description));

			if (name.length > alignment - padding)
				alignment = name.length + padding;
		}

		for (const commandEntry of command.subCommands)
		{
			const subCommand = commandEntry[1];
			parameters.subCommands.push(new ParameterInfo(subCommand.name, subCommand.description));

			if (subCommand.name.length > alignment)
				alignment = subCommand.name.length;
		}

		if (command.name.length > alignment - padding)
			alignment = command.name.length + padding;

		message.appendLine();
		message.append(command.name);
		message.appendLine(StringHelper.padLeft(command.description,
			command.description.length + alignment - command.name.length));

		if (parameters.options.length > 0)
		{
			message.appendLine();
			message.appendLine("OPTIONS: ");
		}

		for (let i = 0; i < parameters.options.length; i++)
		{
			const param = parameters.options[i];
			message.append(StringHelper.padLeft(param.name, param.name.length));
			message.append(StringHelper.padLeft(param.description, param.description.length + alignment - param.name.length));
			if (i < parameters.options.length - 1)
				message.appendLine();
		}

		if (parameters.subCommands.length > 0)
		{
			message.appendLine();
			message.appendLine("SUB-COMMANDS: ");
		}

		for (let i = 0; i < parameters.subCommands.length; i++)
		{
			const param = parameters.subCommands[i];
			message.append(StringHelper.padLeft(param.name, param.name.length));
			message.append(StringHelper.padLeft(param.description, param.description.length + alignment - param.name.length));
			if (i < parameters.subCommands.length - 1)
				message.appendLine();
		}

		return message.toString();
	}

	static createMultipleCommandHelpMessage(commands: Readonly<Array<Command>>)
	{
		const message = new StringBuilder();

		const commandNamesLength = commands.map(c => c.name.length);
		commandNamesLength.push(16); // Minimum alignment
		const alignment = Math.max(...commandNamesLength) + 1;

		message.appendLine();
		for (let i = 0; i < commands.length; i++)
		{
			const command = commands[i];
			message.append(command.name);
			message.append(StringHelper.padLeft(command.description, command.description.length + alignment - command.name.length));
			if (i < commands.length - 1)
				message.appendLine();
		}

		return message.toString();
	}

	public callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken)
	{
		cancellationToken.throwIfCancellationRequested();

		const query = args.get(Help.#s_nameOption.name);
		if (StringHelper.isNullOrWhiteSpace(query))
		{
			const commands = ArrayHelper.asArray(commandLine.commands.values());
			logging.log(LogLevel.Information, `Here's a list of all available commands: ${Help.createMultipleCommandHelpMessage(commands)}`);
			return Promise.resolve();
		}

		const querySegments = query!.split(" ");
		const commandName = querySegments[0];
		let command = commandLine.commands.get(commandName);
		if (!command)
		{
			logging.log(LogLevel.Error, `Unknown command: "${commandName}"`);
			return Promise.resolve();
		}

		for (const subCommandName of querySegments.toSpliced(0, 1))
		{
			const subCommand: Command | undefined = command.subCommands.get(subCommandName);
			if (!subCommand)
			{
				logging.log(LogLevel.Error, `Unknown sub-command: "${commandName}"`);
				return Promise.resolve();
			}

			command = subCommand;
		}

		logging.log(LogLevel.Information, `Here's information about the command: ${Help.createSingleCommandHelpMessage(command)}`);
		return Promise.resolve();
	}
}

class CommandParameters
{
	readonly #_options: ParameterInfo[] = [];
	readonly #_subCommands: ParameterInfo[] = [];

	public get options()
	{
		return this.#_options;
	}

	public get subCommands()
	{
		return this.#_subCommands;
	}
}

class ParameterInfo
{
	readonly #_name: string;
	readonly #_description: string;

	public constructor(name: string, description: string)
	{
		this.#_name = name;
		this.#_description = description;
	}

	public get name()
	{
		return this.#_name;
	}

	public get description()
	{
		return this.#_description;
	}
}
