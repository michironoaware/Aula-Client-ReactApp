import { Command } from "lib/commands/Command.ts";
import { CancellationToken, MessageFlags, MessageType, SendMessageRequestBody } from "aula.js";
import { CommandOption } from "lib/commands/CommandOption.ts";
import { aula } from "lib/aula.ts";
import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";

export class Say extends Command
{
	static readonly #s_messageOption = new CommandOption({
		name: "m",
		description: "The message you want to speak aloud to others nearby.",
		isRequired: true,
		requiresArgument: true,
		canOverflow: true,
	});

	public constructor()
	{
		super();
		this.addOption(Say.#s_messageOption);
	}

	public get name()
	{
		return "say";
	}

	public get description()
	{
		return "Say something aloud to nearby presences."
	}

	public async callback(args: Readonly<Map<string, string>>, cancellationToken: CancellationToken): Promise<void>
	{
		const message = args.get(Say.#s_messageOption.name)!;

		if (!aula.gateway.currentUser?.currentRoomId)
		{
			logging.log(LogLevel.Error,
				"Your attempt to speak has been lost to the void—no room exists to give meaning to your words.");
			return;
		}

		await aula.rest.sendMessage(aula.gateway.currentUser.currentRoomId, new SendMessageRequestBody()
			.withType(MessageType.Standard)
			.withText(message), cancellationToken);
	}
}
