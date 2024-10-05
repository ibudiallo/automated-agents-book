const isArray = (s) => Array.isArray(s);
const toStr = (num) => (num + "");
const arr2Str = (s) => (isArray(s) ? s.join(" ") : toStr(s));
const h = (name, props, nest, selfClosing) => ({ name, props, children: nest, selfClosing });

const addProps = (props) => {
	if (!props) {
		return "";
	}
	return Object.keys(props)
		.map(key => (` ${key}="${arr2Str(props[key])}"`))
		.join(" ");
}

const renderOne = (jml) => {
	if (typeof jml === "string") {
		return jml;
	}
	if (jml.selfClosing) {
		return `<${jml.name}${addProps(jml.props)} />`
	}
	return `<${jml.name}${addProps(jml.props)}>${renderChildren(jml.children)}</${jml.name}>`;
};

const renderChildren = (jml) => {
	if (!jml) return "";
	return isArray(jml)
		? jml.map(a => renderOne(a)).join("")
		: renderOne(jml);
};

const html = (jml) => {
	return renderChildren(jml);
};

export {
	h, html
};