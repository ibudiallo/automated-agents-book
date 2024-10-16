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

const leadingZero = (num) => (num < 10 ? `0${num}`: `${num}`);

const chaptFormat = (chapt) => {
	if (!chapt.name) {
		return chapt.title;
	}
	const num = +(chapt.name.split(" ")[1]);

	return `CH${leadingZero(num)}: ${chapt.title}`;
};

const partFormat = (part) => {
	if (!part.name) {
		return part.title;
	}
	return `${part.name}: ${part.title}`;
};

const dropExtension = (filename) => filename.replace(path.extname(filename), "");

const getIntroUrl = () => toc.sections.parts[0].slug;

const buildSidebar = (selectedPart, selectedChapt) => {
	const filepath = path.join("src", "templates", "sidebar.template.html");
	const content = readFileSync(filepath);
	const parts = toc.sections.parts;
	const obj = h("ul", { class: "sidebar"}, [
		...parts.map(li => {
			const chapts = li.chapters ?? [];
			const partSelectedClass = li.slug === selectedPart.slug ? "selected" : "";
			return h("li", { class: ["nav-part", partSelectedClass] }, [
				h("h2", {}, li.slug ? h("a", { href: li.slug }, li.title) : li.title),
				chapts.length ? h("ul", {}, [
					...chapts.map(chapt => {
						const chaptSelected = li.slug === selectedPart.slug && chapt.slug === selectedChapt?.slug ? "selected" : "";
						return h("li", { class: ["nav-chapt", chaptSelected] }, 
							h("a", { href: chapt.slug, title: chapt.title}, chaptFormat(chapt)),
						);
					})
				]) : "",
			]);
		})
	]);
	const out = html(obj);
	return render(filepath, { sidebar: out})
};

const buildTOC = () => {
	const elements = [];
	const roman = ["0", "0", "I", "II", "III", "IV", "V"];
	toc.sections.parts.map( (part, index) => {
		const chapts = (() => {
			if(!part.chapters) return [];
			return h("ul", {}, part.chapters.map((c) => {
				return h("li", {}, h("a", { href: c.slug}, [
					...(
						c.name
							? [h("span", { class: "toc-chapt__name"}, c.name), ": "]
							: []
					),
					h("span", { class: "toc-chapt__title"}, c.title+" "),
				]));
			}))
		})();
		const rank = index < 2 ? part.title : `Part ${roman[index]}: ${part.title}`;
		elements.push(
			h("li", { class: "toc-list"}, 
				h("div", { }, [
					h("h2", {}, part.slug ? h("a", { href: part.slug }, rank) : rank),
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

function getPreviousLink(partIndex, chaptIndex) {
	// moveing from part to previous chapter
	if (chaptIndex === null) {
		const part = toc.sections.parts[partIndex - 1];
		if (!part) {
			return "";
		}

		if (part && !part.chapters) {
			return html(h("a", { href: part.slug }, "&larr; " + partFormat(part)));
		}
		chaptIndex = part.chapters.length - 1;
		const chapt = part.chapters[chaptIndex];
		return html(h("a", { href: chapt.slug }, "&larr; " + chaptFormat(chapt)));
	}

	// moving from chapter to previous part
	chaptIndex--;
	if(chaptIndex < 0) {
		let part = toc.sections.parts[partIndex];
		// skip parts that don't have pages
		if (!part.slug) {
			part = toc.sections.parts[partIndex - 1];
			if (part && part.chapters) {
				let chapt = part.chapters[part.chapters.length - 1];
				return html(h("a", { href: chapt.slug }, "&larr; " + chaptFormat(chapt)));
			}
			if (!part) {
				return "";
			}
			return html(h("a", { href: part.slug }, "&larr; " + partFormat(part)));
		}
		return html(h("a", { href: part.slug }, "&larr; " + partFormat(part)));
	}
	const part = toc.sections.parts[partIndex]
	if (!part.chapters) {
		return html(h("a", { href: part.slug }, "&larr; " + partFormat(part)));
	}
	const chapt = part.chapters[chaptIndex];
	return html(h("a", { href: chapt.slug }, "&larr; " + chaptFormat(chapt)));
}

function getNextLink(partIndex, chaptIndex) {
	// moving from part to next chapter
	if (chaptIndex === null) {
		const part = toc.sections.parts[partIndex];
		if (!part) {
			return "";
		}
		if (!part.chapters) {
			return "";
			// return  html(h("a", { href: part.slug }, partFormat(part) + " &rarr;"));
		}
		const chapt = part.chapters[0];
		return html(h("a", { href: chapt.slug }, chaptFormat(chapt) + " &rarr;"));
	}

	// moving from chapter to next part
	chaptIndex++;
	if (chaptIndex >= toc.sections.parts[partIndex].chapters.length) {
		chaptIndex = 0;
		partIndex++;
		const part = toc.sections.parts[partIndex];
		if (!part) {
			return "";
		}
		return  html(h("a", { href: part.slug }, partFormat(part) + " &rarr;"));
	}

	// moving to the next chapter
	const part = toc.sections.parts[partIndex];
	const chapt = part.chapters[chaptIndex];
	return html(h("a", { href: chapt.slug }, chaptFormat(chapt) + " &rarr;"));
}

const formatChapterHeader = (chapt, title) => {
	return html(
		h("header", { class: "chapt-hdr"}, [
			h("p", { class: "chapt-hdr__sub" }, h("strong", {}, chapt)),
			h("h1", { class: "chapt-hdr__title" }, title)
		])
	);
};

const getMeta = (part) => {
	const meta = part.meta;
	if (!meta) {
		return "";
	}

	const out = Object.keys(meta)
		.map(key => {
			return h("meta", { name: key, content: meta[key] }, null, true);
		});
	return html(out);
}

function buildParts() {
	const obj = {};
	obj["content.html"] = buildTOC();

	toc.sections.parts.map( (part, partIndex) => {
		if (part.name === "toc") {
			return ;
		}

		if (part.template) {
			const sidebar = buildSidebar(part);
			const fullPath = [BOOK_PATH, part.folder, part.content].filter(notEmpty);
			const contentPath = path.join(...fullPath);
			const templatePath = path.join("src", "templates", part.template);
			const giturl = [GITROOT, part.folder, part.content].join("/");
			const metaTags = getMeta(part);
			const output = renderPaths(contentPath, templatePath, {
				sidebar,
				PAGE_TITLE: part.title,
				META_TAGS: metaTags,
				TITLE: html(h("h1", {}, part.title)),
				ASSET_PATH,
				PreviousURL: getPreviousLink(partIndex, null),
				NextURL: getNextLink(partIndex, null),
				GITURL: html(h("a", { href: giturl, target: "_blank" }, "Github Source")),
			});
			obj[part.slug] = output;
		}
		// chapter
		if (!part.chapters) { return; }

		part.chapters.map((chapt, chaptIndex) => {
			const sidebar = buildSidebar(part, chapt);
			const chapTemplate = path.join("src", "templates", chapt.template);
			const contentPath = path.join(...["book", part.folder, chapt.content].filter(notEmpty));
			const giturl = [GITROOT, part.folder, chapt.content].join("/");
			const pageTitle = chapt.name ? `${chapt.name}: ${chapt.title}` : chapt.title;
			const output = renderPaths(contentPath, chapTemplate, {
				sidebar,
				PAGE_TITLE: pageTitle,
				META_TAGS: "",
				TITLE: formatChapterHeader(chapt.name, chapt.title),
				ASSET_PATH,
				PreviousURL: getPreviousLink(partIndex, chaptIndex),
				NextURL: getNextLink(partIndex, chaptIndex),
				GITURL: html(h("a", { href: giturl, target: "_blank" }, "Github Source")),
			});
			obj[chapt.slug] = output;
		});

	});
	return obj;
}

const structure = {
	"index.html": buildFront(),
	...buildParts(),
}
Object.keys(structure)
.map(key => {
	filewrite(path.join(OUT_PATH, key), structure[key]);
})