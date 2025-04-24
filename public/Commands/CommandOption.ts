export class CommandOption
{
	static readonly #_prefix = "-";

	readonly #_name: string;
	readonly #_description: string;
	readonly #_isRequired: boolean;
	readonly #_requiresArgument: boolean;
	readonly #_canOverflow: boolean;

	public constructor(params: {
		name: string;
		description: string;
		isRequired?: boolean;
		requiresArgument?: boolean;
		canOverflow?: boolean;
	})
	{
		this.#_name = params.name;
		this.#_description = params.description;
		this.#_isRequired = params.isRequired ?? true;
		this.#_requiresArgument = params.requiresArgument ?? true;
		this.#_canOverflow = params.canOverflow ?? false;
	}

	public static get prefix()
	{
		return this.#_prefix;
	}

	public get name()
	{
		return this.#_name;
	}

	public get description()
	{
		return this.#_description;
	}

	public get isRequired()
	{
		return this.#_isRequired;
	}

	public get requiresArgument()
	{
		return this.#_requiresArgument;
	}

	public get canOverflow()
	{
		return this.#_canOverflow;
	}
}
