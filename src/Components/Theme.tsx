import React, { useEffect, useState } from "react";
import { ThemeType, ThemeTypeToDomClass } from "./ThemeType.tsx";
import { events } from "../Services/events";
import { LocalStorageFacade } from "../Services/LocalStorageFacade";
import { TypeHelper } from "../Common";

export default function Theme(args: ThemeArgs)
{
	let themeToUse: ThemeType;
	if (args.theme)
	{
		themeToUse = args.theme;
	} else
	{
		let storedTheme = LocalStorageFacade.theme;
		if (!TypeHelper.isType(storedTheme, ThemeType))
		{
			storedTheme = ThemeType.Vintage;
			LocalStorageFacade.theme = storedTheme;
		}

		const [ theme, setTheme ] = useState<ThemeType>(storedTheme);
		themeToUse = theme;

		useEffect(() =>
		{
			const listener = (theme: ThemeType) =>
			{
				LocalStorageFacade.theme = theme;
				setTheme(theme);
			};

			events.on("ThemeUpdateRequest", listener);
			return () => events.remove("ThemeUpdateRequest", listener);
		}, []);
	}

	const flickerClass = themeToUse === ThemeType.Light ? "light-flicker":"flicker";
	const effects = args.withEffects
		? <div>
			<div className="radial"></div>
			<div className={flickerClass}></div>
			<div className="scanline"></div>
			<div className="scanlines"></div>
		</div>
		:undefined;

	return <div className={`theme ${ThemeTypeToDomClass(themeToUse)}`}>
		{effects}
		{args.children}
	</div>
}

export interface ThemeArgs
{
	children: React.ReactNode;
	theme?: ThemeType;
	withEffects: boolean;
}
