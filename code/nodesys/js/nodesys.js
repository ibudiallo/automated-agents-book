const SVG = (() => {
	const SVG_NS = "http://www.w3.org/2000/svg";
	const { h, render } = JML();
	const DEFAULT_WIDTH = 200;
	const PADDING = 6;
	const LINE_HEIGHT = 12;

	const svgWrapper = (content, width, height) => {
		return h("svg", { version: "1.1", width: 600, height: 600}, content);
	}

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
		});
		const html = svgWrapper(entries);
		return render(root, html);
	};

	// https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
	const makeDraggable = (node, title) => {
		let topParent = node;
		while(topParent) {
			topParent = node.parentNode;
			if (topParent.tagName === "svg") {
				break;
			}
		}
		const getMousePosition = (e) => {
			var CTM = topParent.getScreenCTM();
			return {
				x: Math.round((e.clientX - CTM.e) / CTM.a),
				y: Math.round((e.clientY - CTM.f) / CTM.d),
				offsetX: e.clientX - e.offsetX,
				offsetY: e.clientY - e.offsetY
			};
		};
		const startDrag = () => {
			node.addEventListener("mousemove", drag, false);
			window.addEventListener("mouseup", endDrag);
		};
		const drag = (e) => {
			const pos = getMousePosition(e)
			const [tX, tY]= node.getAttribute("transform")
				.replace(/(translate)|[\(\)\s]/g, "")
				.split(",")
				.map(a => parseFloat(a));
			const x = pos.x - tX;
			const y = pos.y - tY;
			// TODO: get more elegant solution
			node.setAttribute("transform", `translate(${pos.x-20}, ${pos.y-20})`);
		};
		const endDrag = () => {
			node.removeEventListener("mousemove", drag);
			window.removeEventListener("mouseup", endDrag);
		};
		title.addEventListener("mousedown", startDrag);
		title.addEventListener("mouseup", endDrag);
	};

	const commentNode = (data) => {
		const parentNode = {};
		const width = 200 || DEFAULT_WIDTH;
		const onCreate = (e) => {
			parentNode.node = e.target;
		};
		return h("g", { width, id: `comment-${data.id}`, transform: `translate(${data.coord.x}, ${data.coord.y})`, onCreate}, [
			h("rect", { width, height: 100, rx : 6, x: 0, y: 0, fill: "#333"}),
			titleBar(data.title, { width }, parentNode),
			textSnippet(data.content),
		]);
	}

	const titleBar = (title, props, parent) => {
		const onCreate = (e) => {
			parent.titleBar = e.target;
			makeDraggable(parent.node, e.target);
		};
		return h("g", { ...props, onCreate }, [
			h("rect", { width: "100%", height: LINE_HEIGHT * 2, rx : 3, x: 0, y: 0, fill: "#cdcdcd", ...props}),
			h("circle", { cx: PADDING * 2, cy: PADDING * 2, fill: "#8bc34a", r: 6}),
			h("text", { x: 24, y: 17, style: "pointer-events: none" }, title),
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
		const box = SVG.render(root, getJsonData());
	};

	return {
		init,
	};
})();


window.addEventListener("load", () => {
	App.init();
}, false) 