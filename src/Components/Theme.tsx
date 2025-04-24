import React, { useEffect, useState } from "react";
import { ThemeType, ThemeTypeToDomClass } from "./ThemeType.tsx";
import { events } from "../Services";
import { TypeHelper } from "../Common";

const localStorageThemeName = "theme";

export default function Theme(args: ThemeArgs)
{
	let themeToUse: ThemeType;
	if (args.theme)
	{
		themeToUse = args.theme;
	}
	else
	{
		let themeStored = Number(localStorage.getItem(localStorageThemeName));
		if (!TypeHelper.isType(themeStored, ThemeType))
		{
			themeStored = ThemeType.Vintage;
			localStorage.setItem(localStorageThemeName, themeStored.toString());
		}

		const [theme, setTheme] = useState<ThemeType>(themeStored);
		themeToUse = theme;

		useEffect(() =>
		{
			const listener = (theme: ThemeType) =>
			{
				localStorage.setItem(localStorageThemeName, theme.toString());
				setTheme(theme);
			};

			events.on("ThemeUpdateRequest", listener);
			return () => events.remove("ThemeUpdateRequest", listener);
		}, []);
	}

	const flickerClass = themeToUse === ThemeType.Light ? "light-flicker" : "flicker";
	const effects  = args.withEffects
		? <div>
			<div className="radial"></div>
			<div className={flickerClass}></div>
			<div className="scanline"></div>
			<div className="scanlines"></div>
		</div>
		: undefined;

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
