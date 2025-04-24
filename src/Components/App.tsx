import React from "react";
import Body from "./Body";
import Theme from "./Theme.tsx";
import InputTextBox from "./InputTextBox.tsx";
import { TypeHelper, ErrorHelper } from "../Common";
import LogList from "./LogList.tsx";
import { ThemeType } from "./ThemeType.tsx";

export default function App()
{
	let theme = localStorage.getItem("theme") as ThemeType | null;
	if (theme === null || !TypeHelper.isType(theme, ThemeType))
	{
		theme = ThemeType.Vintage;
		localStorage.setItem("theme", theme);
	}

	return <Theme theme={theme} withEffects={true}>
		<Body>
			<LogList></LogList>
			<InputTextBox></InputTextBox>
		</Body>
	</Theme>
}
