import * as commonmark  from "commonmark";

const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();

export const parse = (content) => {
	const parsed = reader.parse(content);
	return writer.render(parsed);
}