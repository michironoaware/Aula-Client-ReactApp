export namespace ArrayHelper
{
	export function asArray<T>(iterable: Iterable<T>)
	{
		return Array.isArray(iterable) ? iterable as T[] : [ ...iterable ];
	}
}
