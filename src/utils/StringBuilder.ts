export class StringBuilder
{
	#_strings: null | string | string[];

	public constructor(string?: string)
	{
		this.#_strings = string ?? null;
	}

	public append(string: string)
	{
		if (this.#_strings === null)
		{
			this.#_strings = string;
			return;
		}

		if (typeof this.#_strings === "string")
		{
			this.#_strings = [ this.#_strings, string ];
			return;
		}

		this.#_strings.push(string);
	}

	public appendLine(string?: string)
	{
		if (string)
			this.append(string);

		this.append("\n");
	}

	public toString()
	{
		if (this.#_strings === null)
			return "";
		return typeof this.#_strings === "string" ? this.#_strings : this.#_strings.join("");
	}
}
