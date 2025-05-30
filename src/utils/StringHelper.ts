﻿import { StringBuilder } from "./StringBuilder.ts";

export namespace StringHelper
{
	export function isNullOrWhiteSpace(str?: string | null)
	{
		return str === undefined ||
		       str === null ||
		       str.length === 0 ||
		       str.trim().length === 0;
	}

	export function padLeft(text: string, totalWidth: number)
	{
		if (text.length >= totalWidth)
			return text;

		const textWithPadding = new StringBuilder();
		const padding = totalWidth - text.length;
		for (let i = 0; i < padding; i++)
			textWithPadding.append(" ");

		textWithPadding.append(text);
		return textWithPadding.toString();
	}

	export function padRight(text: string, totalWidth: number)
	{
		if (text.length >= totalWidth)
			return text;

		const textWithPadding = new StringBuilder(text);
		const padding = totalWidth - text.length;
		for (let i = 0; i < padding; i++)
			textWithPadding.append(" ");

		return textWithPadding.toString();
	}

	export function capitalize(str: string)
	{
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
}
