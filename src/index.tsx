import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";
import { createRoot } from "react-dom/client";
import React, { StrictMode } from "react";
import Body from "./components/Body.tsx";
import InputTextBox from "./features/commands/components/InputTextBox.tsx";
import Theme from "./components/Theme.tsx";
import LogList from "./features/logs/components/LogList.tsx";

logging.add({
	log: (logLevel, message) => console.log(`[${LogLevel[logLevel]}]: ${message}`),
});

const root = createRoot(document.getElementById("root")!);

root.render(
	<StrictMode>
		<Theme withEffects={true}>
			<Body>
				<LogList></LogList>
				<InputTextBox></InputTextBox>
			</Body>
		</Theme>
	</StrictMode>
);
