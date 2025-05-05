export namespace HtmlUtility
{
	export function escapeHtml(text: string)
	{
		return text.replace(/&/g, "&amp;")
		           .replace(/</g, "&lt;")
		           .replace(/>/g, "&gt;")
		           .replace(/"/g, "&quot;")
		           .replace(/'/g, "&#39;");
	}

	export function getHtmlFromMarkdown(text: string)
	{
		return text
			.replace(/~~(.+?)~~/g, "<del>$1</del>")
			.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
			.replace(/__(.+?)__/g, "<strong>$1</strong>")
			.replace(/\*(.+?)\*/g, "<em>$1</em>")
			.replace(/_(.+?)_/g, "<em>$1</em>");
	}
}
