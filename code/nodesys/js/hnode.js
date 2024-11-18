const HNode = (() => {
	const SVG_NS = "http://www.w3.org/2000/svg";
	const { h, render } = JML();
	const DEFAULT_WIDTH = 200;
	const PADDING = 6;
	const LINE_HEIGHT = 12;

	const svgWrapper = (content, width, height) => {
		return h("div", { class: "node-window" },
			h("div", { class: "node-grid"}, 
				content
			)
		);
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
		const onCreate = (e) => {
			parentNode.node = e.target;
		};
		return h("div", { class: "node-element", id: `comment-${data.id}`, style: `left: ${data.coord.x}px; top: ${data.coord.y}px`, onCreate}, [
				titleBar(data.title, parentNode),
				h("div", { class: "node-element-content"}, [
					textSnippet(data.content),
				]),
			]
		);
	}

	const titleBar = (title, parent) => {
		const onCreate = (e) => {
			parent.titleBar = e.target;
			//makeDraggable(parent.node, e.target);
		};
		return h("div", { class: "node-element-title", onCreate }, [
			h("span", { class: "node-status-icon" }, h("i", { class: "icon-open"})),
			h("span", {}, title),
		]);
	};

	const textSnippet = (content) => {
		return h("div", { class: "node-element-input"}, [
			h("span", { class: "node-input-dot"}),
			h("span", { class: "node-input-text-snippet"}, content),
			h("span", { class: "node-output-dot"}),
		]);
	}

	return {
		render: drawSvg,
	}
})();

const App2 = (() => {

	const init = () => {
		console.log(111)
		const root = document.getElementById("root");
		const box = HNode.render(root, getJsonData());
	};

	return {
		init,
	};
})();


window.addEventListener("load", () => {
	App2.init();
}, false) 