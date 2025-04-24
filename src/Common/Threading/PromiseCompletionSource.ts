import { Func } from "..";

/**
 * @sealed
 * */
export class PromiseCompletionSource<TResolve>
{
	readonly #_promise: Promise<TResolve>;
	#_resolve: Func<[ TResolve ]> = null!;
	#_reject: Func<[ any? ]> = null!;
	#_resolved: boolean = false;
	#_rejected: boolean = false;

	public constructor()
	{
		this.#_promise = new Promise<TResolve>((resolve, reject) =>
		{
			this.#_resolve = resolve;
			this.#_reject = reject;
		});
	}

	public get promise()
	{
		return this.#_promise;
	}

	public get resolve()
	{
		this.#_resolved = true;
		return this.#_resolve;
	}

	public get reject()
	{
		this.#_rejected = true;
		return this.#_reject;
	}

	public get isComplete()
	{
		return this.#_resolved || this.#_rejected;
	}

	public get isRejected()
	{
		return this.#_rejected;
	}

	public get isCompleteSuccessfully()
	{
		return this.#_resolved;
	}
}
