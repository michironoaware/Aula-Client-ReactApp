import { Func } from "../Common";
import { useId } from "react";

export default function InputTextBox()
{
	const textareaId = useId();

	return <div className="input-text-box">
		<label htmlFor={textareaId}>{">"}</label>
		<textarea
			id={textareaId}
			autoFocus={true}>
		</textarea>
	</div>
}
