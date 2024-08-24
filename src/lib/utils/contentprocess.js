export const extract = (content, vars) => {
	Object.keys(vars).map(key => {
		content = content.replaceAll(`{{${key}}}`, vars[key]);
	});
	return content;
};