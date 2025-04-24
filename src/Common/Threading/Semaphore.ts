import { PromiseCompletionSource, SemaphoreFullError } from ".";
import { IDisposable, ValueOutOfRangeError } from "..";
import { CancellationToken, OperationCanceledError } from "aula.js";

/**
 * @sealed
 * */
export class Semaphore implements IDisposable
{
	readonly #_queue: PromiseCompletionSource<void>[] = [];
	readonly #_maximumCount: number;
	#_availableCount: number;
	#_disposed: boolean = false;

	constructor(initialCount: number, maximumCount: number)
	{
		ValueOutOfRangeError.throwIfLessThan(initialCount, 0);
		ValueOutOfRangeError.throwIfLessThan(maximumCount, 1);
		ValueOutOfRangeError.throwIfGreaterThan(initialCount, maximumCount);

		this.#_availableCount = initialCount;
		this.#_maximumCount = maximumCount;
	}

	public async waitOne(cancellationToken: CancellationToken = CancellationToken.none)
	{
		cancellationToken.throwIfCancellationRequested();

		if (this.#_availableCount > 0)
		{
			this.#_availableCount--;
			return Promise.resolve();
		}

		const promiseSource = new PromiseCompletionSource<void>();
		if (cancellationToken !== CancellationToken.none)
		{
			cancellationToken.onCancelled(() => promiseSource.reject(new OperationCanceledError()));
		}

		this.#_queue.push(promiseSource);
		return promiseSource.promise;
	}

	public release(releaseCount: number = 1)
	{
		ValueOutOfRangeError.throwIfLessThan(releaseCount, 1);

		for (let i = 0; i < releaseCount; i++)
		{
			if (this.#_availableCount === this.#_maximumCount)
			{
				throw new SemaphoreFullError();
			}

			const dequeued = this.#_queue.shift();
			if (dequeued !== undefined)
			{
				dequeued.resolve();
				continue;
			}

			this.#_availableCount += 1;
		}
	}

	public [Symbol.dispose]()
	{
		if (this.#_disposed)
		{
			return;
		}

		for (const promiseSource of this.#_queue)
		{
			promiseSource.resolve();
		}

		this.#_disposed = true;
	}
}
