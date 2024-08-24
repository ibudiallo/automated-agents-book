import fs from "node:fs";

export const readFileSync = (path) => {
	return fs.readFileSync(path, 'utf8');
};

export const listDir = (folderPath) => {
	return fs.readdirSync(folderPath);
};

export const readJsonFile = (file) => {
	const content = readFileSync(file);
	return JSON.parse(content);
};