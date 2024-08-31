import * as commonmark  from "commonmark";
import { HighlightJS as hljs} from "highlight.js";

const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer({ esc: (a) => (a) });

export const parse = (content) => {
	const parsed = reader.parse(content);
	//const output = writer.render(parsed);
	//return highlightCode(output);
	return hlCode(parsed);
}

function hlCode(parsed) {
	const walker = parsed.walker();
	let event;

	while ((event = walker.next())) {
	    const node = event.node;
	    if (event.entering && node.type === 'code_block') {
	    	const lang = node.info;
			const highlightedCode = hljs.highlight(node.literal, { language: lang }).value;
	        node.literal = highlightedCode;
	    }
	}
	return writer.render(parsed);
}
