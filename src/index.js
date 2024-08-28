import * as commonmark  from "commonmark";
import { readFileSync, listDir, readJsonFile } from "./lib/utils/filereader.js";
import { filewrite } from "./lib/utils/filewrite.js";
import { h, html } from "./lib/utils/html.js";
import { renderPaths, render } from "./lib/utils/renderer.js";
import path from "path";

const toc = readJsonFile("./toc.json");

const BOOK_PATH = "book";
const OUT_PATH = "website";
const ASSET_PATH = ".";
const GITROOT = "https://github.com/ibudiallo/automated-agents-book/blob/master/book";

const notEmpty = (a) => !!a;

const dropExtension = (filename) => filename.replace(path.extname(filename), "");

const getIntroUrl = () => dropExtension(toc.sections.parts[0].content) + ".html";

const buildSidebar = (selectedPart, selectedChapt) => {

	const filepath = path.join("src", "templates", "sidebar.template.html");
	const content = readFileSync(filepath);
	const parts = toc.sections.parts;
	const obj = h("ul", { class: "sidebar"}, [
		...parts.map(li => {
			const chapts = li.chapters ?? [];
			const partSelectedClass = li.slug === selectedPart.slug ? "selected" : "";
			return h("li", { class: ["nav-part", partSelectedClass] }, [
				h("h2", {}, h("a", { href: li.slug }, li.title)),
				...chapts.map(chapt => {
					const chaptSelected = li.slug === selectedPart.slug && chapt.slug === selectedChapt?.slug ? "selected" : "";
					const chaptSlug = [li.folder, chapt.slug].join("-");
					return h("li", { class: ["nav-chapt", chaptSelected] }, 
						h("a", { href: chaptSlug }, chapt.name)
					);
				})
			]);
		})
	]);
	const out = html(obj);
	return render(filepath, { sidebar: out})
	return html(obj);
};

const buildTOC = () => {
	const elements = [];
	toc.sections.parts.map(part => {
		const chapts = (() => {
			if(!part.chapters) return [];
			return h("ul", {}, part.chapters.map((c) => {
				return h("li", {}, h("a", { href: [part.folder, c.slug].join("-")}, c.title ));
			}))
		})();

		elements.push(
			h("li", { class: "toc-list"}, 
				h("div", { }, [
					h("h2", {}, h("a", { href: part.slug }, part.title)),
					chapts,
				])
			)
		)
	});
	const output = html(h("ul", {}, elements));
	const templatePath = path.join("src", "templates", "toc.template.html")
	return render(templatePath, {
		content: output,
		TITLE: "Table of Content",
		ASSET_PATH,
	});
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

function getPreviousPartLink(current, index) {
	if (index < 1) {
		return "";
	}
	const part = toc.sections.parts[index - 1];
	return html(h("a", { href: part.slug }, "&larr; " + part.title));;
}

function getNextLink(current, index) {
	if (!current.chapters) {
		return "";
	}
	const chapter = current.chapters[0];
	const slug = [current.folder, chapter.slug].join("-");
	const name = chapter.name;
	return html(h("a", { href: slug }, name + " &rarr;"));
}

const prevChapterLink = (part, index) => {
	if (index < 1) {
		return html(h("a", { href: part.slug}, "&larr; " + part.title));
	}
	const prev = part.chapters[index - 1];
	const slug = [part.folder, prev.slug].join("-");
	return html(h("a", { href: slug}, "&larr; " + prev.title));
};

const nextChapterLink = (part, index) => {
	if (part.chapters.length - 1 === index) {
		let m = 0;
		toc.sections.parts.some( (p, i) => {
			m = i;
			return p.name === part.name;
		});
		const nextPart = toc.sections.parts[m + 1];
		if (!nextPart) {
			return "";
		}
		const slug = [nextPart.folder, nextPart.slug].join("-");
		return html(h("a", { href: nextPart.slug}, nextPart.title+ " &rarr;"));
	}
	const next = part.chapters[index + 1];
	const slug = [part.folder, next.slug].join("-");
	return html(h("a", { href: slug}, next.title + " &rarr;"));
};

function buildParts() {
	const obj = {};

	toc.sections.parts.map( (part, index) => {
		if (part.name === "toc") {
			const content = buildTOC();
			obj[part.slug] = content;
			return ;
		}
		const sidebar = buildSidebar(part);
		const fullPath = [BOOK_PATH, part.folder, part.content].filter(notEmpty);
		const contentPath = path.join(...fullPath);
		const templatePath = path.join("src", "templates", part.template);
		const giturl = [GITROOT, part.folder, part.content].join("/");
		const output = renderPaths(contentPath, templatePath, {
			sidebar,
			TITLE: part.title,
			ASSET_PATH,
			PreviousURL: getPreviousPartLink(part, index),
			NextURL: getNextLink(part, index),
			GITURL: html(h("a", { href: giturl }, "github source page")),
		});
		const outFilename = [part.folder, dropExtension(part.content)]
			.filter(notEmpty).join("-") + ".html";
		obj[outFilename] = output;

		// chapter
		if (!part.chapters) { return; }

		part.chapters.map((chapt, i) => {
			const sidebar = buildSidebar(part, chapt);
			const chapTemplate = path.join("src", "templates", "chapt.template.html");
			const contentPath = path.join("book", part.folder, chapt.content);
			const giturl = [GITROOT, part.folder, chapt.content].join("/");
			const output = renderPaths(contentPath, chapTemplate, {
				sidebar,
				TITLE: chapt.title,
				ASSET_PATH,
				PreviousURL: prevChapterLink(part, i),
				NextURL: nextChapterLink(part, i),
				GITURL: html(h("a", { href: giturl }, "github source page")),
			});

			const outputFilename = [part.folder, chapt.slug].join("-");
			obj[outputFilename] = output;
		});

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