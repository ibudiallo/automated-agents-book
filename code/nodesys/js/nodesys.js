const SVG = (() => {
	const SVG_NS = "http://www.w3.org/2000/svg";
	const { h, render } = JML();
	const DEFAULT_WIDTH = 200;
	const PADDING = 6;
	const LINE_HEIGHT = 12;

	const svgWrapper = (content) => {
		return h("svg", { version: "1.1", width: 600, height: 600}, content);
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

	const makeDraggable = (node, title) => {
		let topParent = node;
		while(topParent) {
			topParent = node.parentNode;
			if (topParent.tagName === "svg") {
				break;
			}
		}
		node.addEventListener("click", (e) => {
			const [tX, tY]= node.getAttribute("transform")
				.replace(/(translate)|[\(\)\s]/g, "")
				.split(",")
				.map(a => parseFloat(a));
			const x = e.clientX - tX;
			const y = e.clientY - tY;

			//console.log("aa", x, y)
			//node.setAttribute("transform", `translate(${x}, ${x})`);
		})
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
			console.log(x, y)
			node.setAttribute("transform", `translate(${x}, ${y})`);
		};
		const endDrag = () => {
			node.removeEventListener("mousemove", drag);
			window.removeEventListener("mouseup", endDrag);
		};
		title.addEventListener("mousedown", startDrag);
		title.addEventListener("mouseup", endDrag);
/*
		let isDown = false;
		title.addEventListener("mousedown", () => {
			if(isDown) {
				return;
			}
			isDown = true;
			const mouseUp = () => {
				console.log("Up")
				isDown = false;
				window.removeEventListener("mouseup", mouseUp);
				window.removeEventListener("mousemove", mousemove);
			};
			const mousemove = (e) => {
				const x = e.clientX - coord.x - e.offsetX;
				const y = e.clientY - coord.y - e.offsetY;
				node.setAttribute("transform", `transform(${x}, ${y})`);
			}
			window.addEventListener("mouseup", mouseUp, false);
			window.addEventListener("mousemove", mousemove, false)

		}, false);
		*/
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
		content: "Enter comment here",
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