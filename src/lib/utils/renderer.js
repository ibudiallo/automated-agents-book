
import * as markdown from "./markdown.js";
import { readFileSync } from "./filereader.js";
import { extract } from "./contentprocess.js";

export const render = (templatePath, vars) => {
	const template = readFileSync(templatePath);
	const output = extract(template, { ...vars});
	return output;
};

export const renderPaths = (contentPath, templatePath, vars) => {
	const rawContent = readFileSync(contentPath);
	const content = markdown.parse(rawContent);
	const template = readFileSync(templatePath);
	const output = extract(template, { content, ...vars});
	return output;
};