/**
 * The exception that is thrown when the {@link Semaphore.release}
 * method is called on a semaphore whose count is already at the maximum.
 * @sealed
 * */
export class SemaphoreFullError extends Error
{
	/**
	 * Initializes a new instance of {@link SemaphoreFullError}.
	 * */
	public constructor()
	{
		super("The semaphore count is already at the maximum value");
	}
}
