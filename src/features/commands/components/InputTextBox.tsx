import React, { useId } from "react";
import { AulaRestError, CancellationTokenSource, OperationCanceledError, RestClientNullAddressError } from "aula.js";
import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";
import { commandLine } from "../services/commandLine.ts";
import { AulaServiceStateError } from "lib/aula.ts";
import { Say } from "../services/commands/Say.ts";

export default function InputTextBox()
{
	const textareaId = useId();
	const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = async (event) =>
	{
		if (event.key !== "Enter")
			return;

		event.preventDefault();

		const inputElement = document.getElementById(textareaId) as HTMLTextAreaElement;
		const content = inputElement.value;
		inputElement.value = "";

		const cancellation = new CancellationTokenSource();
		const timeout = setTimeout(cancellation.cancel, 5 * 1000);

		try
		{
			if (!content.startsWith(`${Say.name} `))
				logging.log(LogLevel.Information, `> ${content}`);
			await commandLine.processCommand(content, cancellation.token);
		} catch (err)
		{
			if (err instanceof AulaServiceStateError)
				logging.log(LogLevel.Error, err.message);
			else if (err instanceof AulaRestError)
				logging.log(LogLevel.Error, err.problemDetails?.detail ?? err.message);
			else if (err instanceof RestClientNullAddressError)
				logging.log(LogLevel.Error, `A server address is required first. Execute "set-address" to set the server-address.`);
			else if (err instanceof OperationCanceledError)
				logging.log(LogLevel.Error, "The operation has timed out.");
			else
			{
				logging.log(LogLevel.Critical, `An unexpected error occurred. ${(err as Error).message} ${(err as Error).stack}`);
				if (err instanceof TypeError)
					logging.log(LogLevel.Warning,
						"A problem occurred with the request; please verify that the address is valid or that the server is online.");
			}
		}

		clearTimeout(timeout);
	}
	return <div className="input-text-box">
		<label htmlFor={textareaId}>{"> "}</label>
		<textarea
			id={textareaId}
			autoFocus={true}
			onKeyDown={onKeyDown}
			spellCheck={false}
			rows={1}>
		</textarea>
	</div>
}

