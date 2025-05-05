export namespace WebEncoders
{
	export function ToBase64UrlString(input: string)
	{
		return btoa(input)
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");
	}
}
