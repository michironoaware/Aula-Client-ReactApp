import { Func } from "../";

export async function AsNonBlocking<TFunc extends Func<[], TReturn>, TReturn>(func: TFunc): Promise<TReturn>
{
	return new Promise((resolve, reject) =>
	{
		setTimeout(() =>
		{
			try
			{
				resolve(func());
			}
			catch (error)
			{
				reject(error);
			}
		}, 0);
	});
}
