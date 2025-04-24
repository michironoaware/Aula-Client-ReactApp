/**
 * Provides a mechanism for releasing unmanaged resources.
 * */
export interface IDisposable
{
	/**
	 * Performs application-defined tasks associated with freeing, releasing, or resetting resources.
	 */
	[Symbol.dispose](): void;
}
