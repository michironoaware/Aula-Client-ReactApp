import React from "react";
import Body from "./Body";
import Theme from "./Theme.tsx";
import InputTextBox from "./InputTextBox.tsx";
import LogList from "./LogList.tsx";

export default function App()
{
	return <Theme withEffects={true}>
		<Body>
			<LogList></LogList>
			<InputTextBox></InputTextBox>
		</Body>
	</Theme>
}
