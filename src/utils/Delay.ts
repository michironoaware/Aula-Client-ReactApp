export async function Delay(milliseconds: number)
{
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}
