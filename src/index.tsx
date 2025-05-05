import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "components/App.tsx";

logging.add({
	log: (logLevel, message) => console.log(`[${LogLevel[logLevel]}]: ${message}`),
});

const root = createRoot(document.getElementById("root")!);

root.render(
	<StrictMode>
		<App/>
	</StrictMode>
);
