import { createRoot } from "react-dom/client";
import App from "components/App.tsx";
import { StrictMode } from "react";
import "styles/index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
	<StrictMode>
		<App></App>
	</StrictMode>
);
