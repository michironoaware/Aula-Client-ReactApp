import { CancellationToken, LogInRequestBody } from "aula.js";
import { RestHelper } from "../Commands/RestHelper.ts";
import { gatewayClient, setToken } from "../gatewayClient.ts";
import { loggers } from "../loggers.ts";
import { LogLevel } from "../../Common/Logging";

export async function logIn(params: ILogInParams)
{
	const logInRequestBody = new LogInRequestBody()
		.withUserName(params.username)
		.withPassword(params.password);

	let logInAttempt = await RestHelper.HandleRestErrors(
		async () => await gatewayClient.rest.logIn(logInRequestBody, params.cancellationToken));
	if (!logInAttempt.succeeded)
		return;
	let logInResponse = logInAttempt.value;

	setToken(logInResponse.token);

	const currentUser = await gatewayClient.rest.getCurrentUser(params.cancellationToken);
	loggers.log(LogLevel.Information, `Logged in as ${currentUser.displayName}.`);
}

export interface ILogInParams
{
	username: string;
	password: string;
	cancellationToken: CancellationToken;
}
