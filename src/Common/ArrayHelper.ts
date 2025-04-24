export namespace ArrayHelper
{
	export function asArray<T>(iter: Iterable<T> | Iterator<T>)
	{
		if (Array.isArray(iter))
			return iter as T[];

		if (Symbol.iterator in iter)
			return [ ... iter ];

		const arr = [];
		let current: IteratorResult<T> = iter.next();
		while (!current.done)
		{
			arr.push(current.value);
			iter.next();
		}

		return arr;
	}
}
