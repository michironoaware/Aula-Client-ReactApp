import React from "react";
import Theme from "./Theme.tsx";
import Body from "./Body.tsx";
import LogList from "features/logs/components/LogList.tsx";
import InputTextBox from "features/commands/components/InputTextBox.tsx";
import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";

export default function App()
{
	logging.add({
		log: (logLevel, message) => console.log(`[${LogLevel[logLevel]}]: ${message}`),
	});

	return <Theme withEffects={true}>
		<Body>
			<LogList></LogList>
			<InputTextBox></InputTextBox>
		</Body>
	</Theme>
}
