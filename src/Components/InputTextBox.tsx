import React, { useId } from "react";
import { CancellationTokenSource, OperationCanceledError } from "aula.js";
import { commandLine, loggers } from "../Services";
import { LogLevel } from "../Common/Logging";

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
			loggers.log(LogLevel.Information, `> ${content}`);
			await commandLine.processCommand(content, cancellation.token);
		}
		catch (err)
		{
			if (!(err instanceof OperationCanceledError))
				// Unexpected error, rethrow.
				throw err;

			loggers.log(LogLevel.Error, "The operation has timed out.");
		}

		clearTimeout(timeout);
	}
	return <div className="input-text-box">
		<label htmlFor={textareaId}>{">"}</label>
		<textarea
			id={textareaId}
			autoFocus={true}
			onKeyDown={onKeyDown}
			spellCheck={false}>
		</textarea>
	</div>
}

