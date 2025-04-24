/**
 * Provides a mechanism for releasing unmanaged resources asynchronously.
 * */
export interface IAsyncDisposable
{
	/**
	 * Performs application-defined tasks associated with freeing, releasing, or resetting resources asynchronously.
	 */
	[Symbol.asyncDispose](): Promise<void>;
}
