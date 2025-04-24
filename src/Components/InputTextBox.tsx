import { Func } from "../Common";
﻿import React, { useId } from "react";

export default function InputTextBox(args: InputTextBoxArgs)
{
	const textareaId = useId();

	return <div className="input-text-box">
		<label htmlFor={textareaId}>{">"}</label>
		<textarea
			id={textareaId}
			autoFocus={true}
			onChange={args.onChange}>
		</textarea>
	</div>
}

export interface InputTextBoxArgs
{
	onChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined
}
