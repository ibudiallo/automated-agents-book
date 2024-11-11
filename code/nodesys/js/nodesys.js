const SVG = (() => {
	const { h, render } = JML();
	const DEFAULT_WIDTH = 200;

	const svgWrapper = (content) => {
		return h("svg", { version: "1.1"}, content);
	}
	const drawBox = (node) => {
		const width = 300,
			height = 200;
		return h("g", {}, [
			h("rect", { x: 2, y: 2, width, height, stroke: "#cdcdcd", "stroke-width": 2, rx: 2, ry: 2, fill: "#f0f0f0" }),
		]);
	};

	const drawSvg = (root, json) => {
		const entries = [];
		json.data.map(data => {
			switch(data.type) {
			case "Comment":
				entries.push(commentNode(data));
				break;
			default: 
				throw `Unknown node ${data.type}`;
			}
			//entries.push(drawBox(data));
		});
		const html = svgWrapper(entries);
		return render(root, html);
	};

	const commentNode = (data) => {
		const width = 200 || DEFAULT_WIDTH;
		return h("g", { width, id: `comment-${data.id}`, transform: `translate(${data.coord.x}, ${data.coord.y})`}, [
			h("rect", { width, height: 100, rx : 6, x: 0, y: 0, fill: "#333"}),
			titleBar(data.title, { width }),
			textSnippet(data.content),
		]);
	}

	const titleBar = (title, props) => {
		return h("g", { ...props }, [
			h("rect", { width: "100%", height: 24, rx : 3, x: 0, y: 0, fill: "#cdcdcd", ...props}),
			h("circle", { cx: 12, cy: 12, fill: "#8bc34a", r: 6}),
			h("text", { x: 24, y: 17 }, title),
		]);
	};

	const textSnippet = (content) => {
		const max = 12;
		const text = content.length < max
			? content
			: content.substr(0, max) + "...";
		return h("g", {}, 
			h("text", { x: 12, y: 50, width: 60, fill: "#f0f0f0" }, text)
		);
	}

	return {
		render: drawSvg,
	}
})();

const App = (() => {

	const init = () => {
		const root = document.getElementById("root");
		const box = SVG.render(root, JsonData);
	};

	return {
		init,
	};
})();

const JsonData = {
	version: "1.0",
	data: [{
		id: "0000001",
		type: "Comment",
		title: "Comment",
		content: "Here we make a long comment",
		parent: null,
		coord: {
			x: 0,
			y: 0
		}
	},{
		id: "0000002",
		type: "Comment",
		title: "Comment",
		content: "Here we make a long comment",
		parent: null,
		coord: {
			x: 0,
			y: 150
		}
	}]
}

window.addEventListener("load", () => {
	App.init();
}, false)