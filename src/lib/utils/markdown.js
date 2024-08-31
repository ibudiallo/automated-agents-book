import * as commonmark  from "commonmark";
import { HighlightJS as hljs} from "highlight.js";
import { parse as parseHTML } from "node-html-parser";

const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();

export const parse = (content) => {
	const parsed = reader.parse(content);
	const output = writer.render(parsed);
	return highlightCode(output);
}

function highlightCode(htmlStr) {
	const root = parseHTML(htmlStr, { blockTextElements: { code: true }});
	const elements = root.querySelectorAll("code");
	elements.map(e => {
		let lang = null;
		let code = "";
		if (e.attributes["class"]) {
			lang = e.attributes["class"].split("-")[1];
		}
		if (lang) {
			code = hljs.highlight(e.text, { language: lang}).value;
		} else {
			code = hljs.highlightAuto(e.text);
		}
		e.set_content(code);
	});
	return root.toString();
}