﻿import React, { useEffect } from "react";
import Theme from "./Theme.tsx";
import Body from "./Body.tsx";
import LogList from "features/logs/components/LogList.tsx";
import InputTextBox from "features/commands/components/InputTextBox.tsx";
import { logging } from "lib/logging.ts";
import { LogLevel } from "utils/logging/LogLevel.ts";
import { aula } from "lib/aula.ts";
import TypingAlert from "../features/logs/components/TypingAlert.tsx";

export default function App()
{
	const startApp = async () =>
	{
		if (!aula.gateway.hasToken)
		{
			logging.log(LogLevel.Information, "Not logged in.");
			return;
		}

		logging.log(LogLevel.Information, "Connecting to the server...");
		await aula.gateway.connect();
		logging.log(LogLevel.Information, "Connection established successfully.");
	}

	const stopApp = () =>
	{
		aula.gateway.disconnect().then();
	}

	useEffect(() =>
	{
		startApp().then();
		return stopApp;
	}, []);

	return <Theme withEffects={true}>
		<Body>
			<LogList></LogList>
			<TypingAlert></TypingAlert>
			<InputTextBox></InputTextBox>
		</Body>
	</Theme>
}
