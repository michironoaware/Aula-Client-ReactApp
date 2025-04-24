import React, { useId } from "react";

export default function InputTextBox(args: InputTextBoxArgs)
{
	const textareaId = useId();

	return <div className="input-text-box">
		<label htmlFor={textareaId}>{">"}</label>
		<textarea
			id={textareaId}
			autoFocus={true}
			onKeyDown={args.onKeyDown}>
		</textarea>
	</div>
}

export interface InputTextBoxArgs
{
	onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> | undefined
}
