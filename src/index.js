import * as commonmark  from "commonmark";
import { readFileSync, listDir, readJsonFile } from "./lib/utils/filereader.js";
import { filewrite } from "./lib/utils/filewrite.js";
import { h, html } from "./lib/utils/html.js";
import { renderPaths, render } from "./lib/utils/renderer.js";
import path from "path";

const tocj = readJsonFile("./toc.json");

const BOOK_PATH = "book";
const OUT_PATH = "website";
const ASSET_PATH = ".";
const GITROOT = "https://github.com/ibudiallo/automated-agents-book/blob/master/book";

const notEmpty = (a) => !!a;

const leadingZero = (num) => (num < 10 ? `0${num}`: `${num}`);

const chaptFormat = (chapt) => {
	if (chapt.root || chapt.section) {
		return chapt.title;
	}
	if (!chapt.name) {
		return chapt.title;
	}
	const num = +(chapt.name.split(" ")[1]);
	return `CH${leadingZero(num)}: ${chapt.title}`;
};

const getToc = (id) => {
	for(let i = 0, l = tocj.pages.length; i < l; i++) {
		const page = tocj.pages[i];
		if (page.id === id) {
			return page;
		}
	}
	return false;
};

const getIntroUrl = () => getToc("toc").slug;

const getPLink = (id) => {
	let index = 0;
	for(let i = 0, l = tocj.toc.length; i <l; i++) {
		if (tocj.toc[i] === id) {
			index = i - 1;
			break;
		}
	}
	if (index < 0) {
		return false;
	}
	const pageId = tocj.toc[index];
	const current = getToc(pageId);
	return html(h("a", { href: current.slug }, "&larr; " + chaptFormat(current)));
};

const getNLink = (id) => {
	let index = 0;
	for(let i = 0, l = tocj.toc.length; i <l; i++) {
		if (tocj.toc[i] === id) {
			index = i + 1;
			break;
		}
	}
	if (!tocj.toc[index]) {
		return false;
	}
	const pageId = tocj.toc[index];
	const current = getToc(pageId);
	return html(h("a", { href: current.slug }, chaptFormat(current) + " &rarr;"));
};

const buildSidebar = (pageId) => {
	const filepath = path.join("src", "templates", "sidebar.template.html");
	const content = readFileSync(filepath);
	const parts = tocj.toc;
	const obj = h("ul", { class: "sidebar"}, [
		...parts.map(id => {
			const current = getToc(id);
			const isSelected = id === pageId
			return h("li", { 
					class: [
						"nav-list__item", 
						(current.root && "nav-list__root"), 
						(current.section && "nav-list__part"),
						(isSelected && "nav-list__selected")
					].filter(notEmpty)
				}, 
				h("a", { href: current.slug }, 
					current.root 
						? current.title
						: current.section
						? current.name + ": " + current.title
						: chaptFormat(current)
				)
			);
		})
	]);
	const out = html(obj);
	return render(filepath, { sidebar: out});
};

const buildTOC = () => {
	const pagesInOrder = tocj.toc;
	const elements = [];

	pagesInOrder.map(page => {
		const current = getToc(page);
		if(current.root) {
			elements.push(
				h("li", { class: "toc-list-root"}, 
					h("a", { href: current.slug }, current.name)
				)
			);
		} else if(current.section) {
			elements.push(
				h("li", { class: "toc-list-section"}, 
					h("h2", {}, 
						h("a", { href: current.slug }, [
							current.name,
							": ",
							current.title
						])
					)
				)
			);
		} else {
			elements.push(
				h("li", { class: "toc-list-chapter"}, 
					h("a", { href: current.slug }, [
						h("span", { class: "toc-chapt__name"}, current.name + ": "),
						current.title
					])
				)
			);
		}
	});
	
	const output = html(h("ul", {}, elements));
	const entry = getToc("toc");

	const templatePath = path.join("src", "templates", entry.template)
	return render(templatePath, {
		content: output,
		TITLE: "Table of Content",
		ASSET_PATH,
	});
};

function buildFront() {
	const front = getToc("homepage");
	const contentPath = path.join(BOOK_PATH, front.content);
	const frontTemplate = path.join("src", "templates", front.template);

	const output = renderPaths(contentPath, frontTemplate, {
		ASSET_PATH,
		FRONT_URL: getIntroUrl(),
	});
	return output;
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

	tocj.toc.map(id => {
		const current = getToc(id);
		if (current.skip || !current.template || current.content === "auto") {
			return ;
		}
		const sidebar = buildSidebar(id);
		const templatePath = path.join("src", "templates", current.template);
		const fullPath = [BOOK_PATH, ...current.content.split("/")].filter(notEmpty);
		const contentPath = path.join(...fullPath);
		const giturl = [GITROOT, current.content].join("/");
		const metaTags = getMeta(current);

		const output = renderPaths(contentPath, templatePath, {
			sidebar,
			PAGE_TITLE: current.title,
			META_TAGS: metaTags,
			TITLE: html(h("h1", {}, current.title)),
			ASSET_PATH,
			PreviousURL: getPLink(id),
			NextURL: getNLink(id),
			GITURL: html(h("a", { href: giturl, target: "_blank" }, "Github Source")),
		});

		obj[current.slug] = output;
	});
	return obj;
}

const SiteUrl = function(opt) {
	this.loc = opt.loc;
	this.priority = opt.priority || .75;
	const lastmod = (new Date()).toJSON();
	this.toString = () => {
		return [`<url>`,
			`\t<loc>${opt.loc}</loc>`,
			`\t<changefreq>weekly</changefreq>`,
			`\t<priority>${(opt.priority || .75).toFixed(2)}</priority>`,
			`\t<lastmod>${lastmod}</lastmod>`,
		`</url>`].join("\n");
	}
}

const buildSitemap = () => {
	const urls = [
		(new SiteUrl({
			loc: `https://automatedagentsbook.com/`,
			priority: 1,
		})).toString(),
		(new SiteUrl({
			loc: `https://automatedagentsbook.com/content.html`,
			priority: 1,
		})).toString()
	];
	tocj.toc.map(id => {
		const current = getToc(id);
		if (current.skip || !current.template || current.content === "auto") {
			return ;
		}
		urls.push((new SiteUrl({
			loc: `https://automatedagentsbook.com/${current.slug}`,
			priority: current.section ? 1 : .75,
		})).toString());
	});
	
	let content = [
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`,
		...urls,
		`</urlset>`
	];
	return {
		"sitemap.xml": content.join("\n"),
	};
};

const structure = {
	"index.html": buildFront(),
	...buildParts(),
	...buildSitemap(),
}
Object.keys(structure)
.map(key => {
	filewrite(path.join(OUT_PATH, key), structure[key]);
})