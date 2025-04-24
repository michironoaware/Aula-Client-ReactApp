import { Func } from "./Common";

export namespace ErrorHelper
{
	export function Try(func: Func<[]>)
	{
		try
		{
			func();
			return true;
		}
		catch (err)
		{
			return false;
		}
	}
}
