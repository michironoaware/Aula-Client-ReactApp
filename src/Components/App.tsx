import React from "react";
import Theme from "components/Theme.tsx";
import Body from "components/Body.tsx";
import LogList from "components/LogList.tsx";
import InputTextBox from "../features/commands/components/InputTextBox.tsx";

export default function App()
{
	return <Theme withEffects={true}>
		<Body>
			<LogList></LogList>
			<InputTextBox></InputTextBox>
		</Body>
	</Theme>
}
