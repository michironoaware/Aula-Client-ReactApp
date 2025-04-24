import { StringBuilder } from "./StringBuilder.ts";

export namespace StringHelper
{
	export function padLeft(text: string, totalWidth: number)
	{
		if (text.length >= totalWidth)
			return text;
		
		const textWithPadding = new StringBuilder();
		const padding = totalWidth - text.length;
		for (let i = 0; i < padding; i++)
			textWithPadding.append(" ");

		textWithPadding.appendLine(text);
		return textWithPadding.toString();
	}
}
