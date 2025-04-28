import { Func } from "../../Common";
import { AulaRestError, RestClientNullAddressError } from "aula.js";
import { loggers } from "../loggers.ts";
import { LogLevel } from "../../Common/Logging";

export namespace RestHelper
{
	export async function HandleRestErrors<T>(callback: Func<[], T>)
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
				loggers.log(LogLevel.Error, err.problemDetails?.detail ?? err.message);
			else if (err instanceof RestClientNullAddressError)
				loggers.log(LogLevel.Error, `A server address is required first. Execute "set-address" to set the server-address.`);
			else
			{
				loggers.log(LogLevel.Critical, `An unexpected error occurred. ${(err as Error).message} ${(err as Error).stack}`);
				if (err instanceof TypeError)
					loggers.log(LogLevel.Warning,
						"A problem occurred with the request; please verify that the address is valid or that the server is online.");
			}

			return { succeeded: false };
		}
	}
}

interface HandleRestErrorsResult<T>
{
	succeeded: boolean;
	value?: T;
}
