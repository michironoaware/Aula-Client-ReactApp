import { TypeHelper } from "./TypeHelper.ts";

export class StringBuilder
{
	#_strings: string | string[];

	public constructor(string: string = "")
	{
		this.#_strings = string;
	}

	public append(string: string)
	{
		if (typeof this.#_strings === "string")
		{
			this.#_strings = [ this.#_strings, string ];
			return;
		}

		this.#_strings.push(string);
	}

	public toString()
	{
		return typeof this.#_strings === "string" ? this.#_strings : this.#_strings.join();
	}
}
