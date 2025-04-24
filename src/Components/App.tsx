import React from "react";
import Body from "./Body";
import Theme from "./Theme.tsx";
import InputTextBox from "./InputTextBox.tsx";
import { TypeHelper } from "../Common";
import LogList from "./LogList.tsx";
import { ThemeType } from "./ThemeType.tsx";

const exampleText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum;"

export default function App()
{
	let theme = localStorage.getItem("theme") as ThemeType;
	if (theme === null || !TypeHelper.isType(theme, ThemeType))
	{
		theme = ThemeType.Vintage;
		localStorage.setItem("theme", theme);
	}

	return <Theme theme={theme} withEffects={true}>
		<Body>
			{exampleText}
			<LogList></LogList>
			<InputTextBox></InputTextBox>
		</Body>
	</Theme>
}
