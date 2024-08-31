import { HighlightJS as hljs} from "highlight.js";
import * as markdown from "./lib/utils/markdown.js";


import * as commonmark  from "commonmark";

const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer({ safe: false, esc: (a) =>{
	console.log("esc", a); return a;
}  });

const ticks = "```";
const text = `
# Hello World

Below is the code I need.

${ticks}js
const name = "Ibrahim Diallo";
name.split("").map(b => {
	console.log(b);
});

if (name === "blue") {
	return 123;
}
${ticks}
`;

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


const parsed = reader.parse(text);

const code = hlCode(parsed);
console.log(code)
