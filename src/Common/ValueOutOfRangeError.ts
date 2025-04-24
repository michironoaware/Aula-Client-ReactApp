/**
 * Thrown when a value is out of the expected range.
 * @sealed
 * */
export class ValueOutOfRangeError extends Error
{
	/**
	 * Initializes a new instance of {@link ValueOutOfRangeError}.
	 * @package
	 * */
	public constructor(message: string)
	{
		super(message);
	}

	/**
	 * Throws a {@link ValueOutOfRangeError} if {@link value} is equal to {@link other}.
	 * @param value The value to compare against {@link other}.
	 * @param other The other value.
	 * @package
	 * */
	public static throwIfEqual(value: number, other: number)
	{
		if (value === other)
		{
			throw new ValueOutOfRangeError("Value is equal to other");
		}
	}

	/**
	 * Throws a {@link ValueOutOfRangeError} if {@link value} is greater than {@link other}.
	 * @param value The value to compare against {@link other}.
	 * @param other The other value.
	 * @package
	 * */
	public static throwIfGreaterThan(value: number, other: number)
	{
		if (value > other)
		{
			throw new ValueOutOfRangeError("value is greater than other");
		}
	}

	/**
	 * Throws a {@link ValueOutOfRangeError} if {@link value} is greater than or equal to {@link other}.
	 * @param value The value to compare against {@link other}.
	 * @param other The other value.
	 * @package
	 * */
	public static throwIfGreaterThanOrEqual(value: number, other: number)
	{
		if (value >= other)
		{
			throw new ValueOutOfRangeError("value is greater than or equal to other");
		}
	}

	/**
	 * Throws a {@link ValueOutOfRangeError} if {@link value} is less than {@link other}.
	 * @param value The value to compare against {@link other}.
	 * @param other The other value.
	 * @package
	 * */
	public static throwIfLessThan(value: number, other: number)
	{
		if (value < other)
		{
			throw new ValueOutOfRangeError("value is less than other");
		}
	}

	/**
	 * Throws a {@link ValueOutOfRangeError} if {@link value} is less than or equal to {@link other}.
	 * @param value The value to compare against {@link other}.
	 * @param other The other value.
	 * @package
	 * */
	public static throwIfLessThanOrEqual(value: number, other: number)
	{
		if (value <= other)
		{
			throw new ValueOutOfRangeError("value is less than or equal to other");
		}
	}

	/**
	 * Throws a {@link ValueOutOfRangeError} if {@link value} is not equal to {@link other}.
	 * @param value The value to compare against {@link other}.
	 * @param other The other value.
	 * @package
	 * */
	public static throwIfNotEqual(value: number, other: number)
	{
		if (value !== other)
		{
			throw new ValueOutOfRangeError("value is not equal to other");
		}
	}
}
