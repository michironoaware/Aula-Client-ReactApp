import { Func } from "../../Common";
import { AulaRestError, RestClientNullAddressError } from "aula.js";
import { LogLevel } from "../../Common/Logging";
import { logging } from "../LoggingService.ts";

export namespace RestHelper
{
	export async function HandleRestErrors<T>(callback: Func<[], T>): Promise<RestErrorHandlingResult<Awaited<T>>>
	{
		try
		{
			return {
				succeeded: true,
				value: await callback()
			};
		}
		catch (err)
		{
			if (err instanceof AulaRestError)
				logging.log(LogLevel.Error, err.problemDetails?.detail ?? err.message);
			else if (err instanceof RestClientNullAddressError)
				logging.log(LogLevel.Error, `A server address is required first. Execute "set-address" to set the server-address.`);
			else
			{
				logging.log(LogLevel.Critical, `An unexpected error occurred. ${(err as Error).message} ${(err as Error).stack}`);
				if (err instanceof TypeError)
					logging.log(LogLevel.Warning,
						"A problem occurred with the request; please verify that the address is valid or that the server is online.");
			}

			return { succeeded: false };
		}
	}
}

type RestErrorHandlingResult<T> = FailedRestErrorHandlingResult<T> | SuccessfulRestErrorHandlingResult<T>;

interface FailedRestErrorHandlingResult<T>
{
	succeeded: false;
}

interface SuccessfulRestErrorHandlingResult<T>
{
	succeeded: true;
	value: T;
}
