export namespace BigIntHelper
{
	export function AsBigInt(value: number | bigint)
	{
		return typeof value === 'bigint' ? value : BigInt(value);
	}
}
