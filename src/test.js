import { HighlightJS as hljs} from "highlight.js";
import * as markdown from "./lib/utils/markdown.js";

import { parse } from "node-html-parser";

import * as commonmark  from "commonmark";

const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();




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

function highlightCode(htmlStr) {
	const root = parse(htmlStr, { blockTextElements: { code: true }});
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

const data = markdown.parse(text);

const code = highlightCode(data);
console.log(code);

/*
const a = reader.parse(text);


const walker = a.walker();
let event = null;
while ((event = walker.next())) {
    let type = event.node.type;
    if (type === "code_block") {
    	const code = event.node._literal
    	const lang = event.node.info;
    	const res = hljs.highlight(code, { language: lang});
    	event.node._literal = res.value;
    }
}

const output = writer.render(a);
*/