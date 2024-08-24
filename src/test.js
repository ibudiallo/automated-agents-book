import { h, html } from "./lib/utils/html.js";

const out = h("ul", { class: "test"}, [
	h("li", { class: ["hello", "world"]}, "1"),
	h("li", {}, "2"),
	h("li", {}, "3"),
]);

const res = html(out);

console.log(res)