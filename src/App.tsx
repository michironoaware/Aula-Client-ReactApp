import React from "react";
import Body from "./Body";
import Theme, { ThemeType } from "./Theme.tsx";

export default function App()
{
	return <Theme theme={ThemeType.Dark}>
		<Body></Body>
	</Theme>
}
