import fs from "node:fs";

export const filewrite = (filepath, content) => {
	fs.writeFileSync(filepath, content);
	return true;
};
