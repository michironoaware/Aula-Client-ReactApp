export namespace NumberHelper
{
	export function HasFlag(value: number, flag: number)
	{
		return (value & flag) === flag;
	}
}
