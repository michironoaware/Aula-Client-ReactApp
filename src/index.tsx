import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./Components/App.tsx";
import { loggers } from "./Services/loggers";
import { LogLevel } from "./Common/Logging";

loggers.add({
	log: (logLevel, message) => console.log(`[${LogLevel[logLevel]}]: ${message}`),
});

const root = createRoot(document.getElementById("root")!);

root.render(
	<StrictMode>
		<App/>
	</StrictMode>
);
