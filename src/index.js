import * as commonmark  from "commonmark";
import { readFileSync, listDir, readJsonFile } from "./lib/utils/filereader.js";
import { filewrite } from "./lib/utils/filewrite.js";
import { h, html } from "./lib/utils/html.js";
import { renderPaths, render } from "./lib/utils/renderer.js";
import path from "path";

const toc = readJsonFile("./toc.json");

const BOOK_PATH = "book";
const OUT_PATH = "dist";
const ASSET_PATH = "..";

const notEmpty = (a) => !!a;

const dropExtension = (filename) => filename.replace(path.extname(filename), "");

const getIntroUrl = () => dropExtension(toc.sections.parts[0].content) + ".html";

const buildSidebar = (selected) => {
	const filepath = path.join("src", "templates", "sidebar.template.html");
	const content = readFileSync(filepath);
	const parts = toc.sections.parts;
	const obj = h("ul", { class: "sidebar"}, [
		...parts.map(li => {
			return h("li", {}, 
				h("h2", {}, li.name)
			);
		})
	]);
	const out = html(obj);
	return render(filepath, { sidebar: out})
	return html(obj);
};


function buildFront() {
	const contentPath = path.join(BOOK_PATH, toc.front.content);
	const frontTemplate = path.join("src", "templates", toc.front.template);
	const output = renderPaths(contentPath, frontTemplate, {
		ASSET_PATH, 
		FRONT_URL: getIntroUrl(),
	});
	return output;
}

function getPrevious(current, index) {
	console.log("current", current, index)
}

function buildParts() {
	const obj = {};

	toc.sections.parts.map( (part, index) => {
		const sidebar = buildSidebar();
		const fullPath = [BOOK_PATH, part.folder, part.content].filter(notEmpty);
		const contentPath = path.join(...fullPath);
		const templatePath = path.join("src", "templates", part.template);
		const output = renderPaths(contentPath, templatePath, {
			sidebar,
			ASSET_PATH,
			title: part.title,
			previousUrl: getPrevious(part),
			//nextUrl: getNext(part),
		});
		const outFilename = [part.folder, dropExtension(part.content)]
			.filter(notEmpty).join("-") + ".html";
		obj[outFilename] = output;
		return obj;
	});
	return obj;

}

const structure = {
	"front.html": buildFront(),
	...buildParts(),
}
Object.keys(structure)
.map(key => {
	filewrite(path.join(OUT_PATH, key), structure[key]);
})

//console.log(Object.keys(structure))
/*

const BOOK_PATH = "book";
const frontFile = path.join(BOOK_PATH, "front.md");

const frontMD = readFileSync(frontFile);
const frontTemplate = readFileSync(path.join("src", "templates", "front.template.html"));

// console.log(frontTemplate);

var reader = new commonmark.Parser();
var writer = new commonmark.HtmlRenderer();
var parsed = reader.parse(frontMD);



// transform parsed if you like...
var result = writer.render(parsed);
const frontPage = frontTemplate.replace("{{front.md}}", result)
 // result is a String
// console.log(frontPage)]
/*
var reader = new commonmark.Parser();
var writer = new commonmark.HtmlRenderer();
var parsed = reader.parse("Hello *world*"); // parsed is a 'Node' tree
// transform parsed if you like...
var result = writer.render(parsed); // result is a String
console.log(result)
*/