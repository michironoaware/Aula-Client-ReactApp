export namespace BigIntHelper
{
	export function AsBigInt(value: number | bigint)
	{
		return typeof value === "bigint" ? value : BigInt(value);
	}

	export function RangeHash(inputValue: bigint, min: bigint, max: bigint)
	{
		const lo = min < max ? min : max;
		const hi = min < max ? max : min;
		const size = hi - lo + 1n;
		const offset = ((inputValue % size) + size) % size;
		return lo + offset;
	}

	export function HasFlag(value: bigint, flag: number | bigint)
	{
		const flagAsBigInt = AsBigInt(flag);
		return (value & flagAsBigInt) === flagAsBigInt;
	}
}
