const HNode = (() => {
	const SVG_NS = "http://www.w3.org/2000/svg";
	const { h, render } = JML();
	const DEFAULT_WIDTH = 200;
	const PADDING = 6;
	const LINE_HEIGHT = 12;
	let ROOT = null;


	const leftPad = (val, count, char) => {
		const a = val.toString();
		return `${char.repeat(count - a.length)}${a}`
	};
	const getRandomInt = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	const getRandomPaddedString = (len) => {
		return leftPad(getRandomInt(1,9999),4, "0");
	};

	const generateId = () => {
		return `${getRandomPaddedString(4)}-${getRandomPaddedString(4)}-${getRandomPaddedString(4)}-${getRandomPaddedString(4)}`;
	}

	const CreateNode = (type) => {
		switch(type) {
		case "Comment":
			const data = {
				id: generateId(),
				type: "Comment",
				title: "Comment",
				parent: null,
				input: [{
					id: generateId(),
					type: "TEXT",
					value: "Enter comment here",
				}],
				output: [],
				coord: {
					x: 250,
					y: 20
				}
			};jsonData.data.push(data);
			return commentNode(data);
			break;
		}
	}

	const AddNodeButton = () => {
		const onclick = () => {
			const html = CreateNode("Comment")
			render(ROOT.querySelector(".node-grid"), html)
		};
		return h("div", { class: "node-add-btn", onclick}, [
			h("span", { class: "node-add-btn__txt"}, "Add Node")
		]);
	}

	const wrapper = (content, width, height) => {
		return h("div", { class: "node-window" }, [
			h("div", { class: "node-grid"}, 
				content
			),
			AddNodeButton(),
		]);
	}

	let jsonData = null;

	const drawSvg = (root, json) => {
		ROOT = root;
		jsonData = json;

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
		const html = wrapper(entries);
		return render(root, html);
	};

	const makeDraggable = (node, pos) => {
		let currentPos = { x: pos.x, y: pos.y};
		let isDragging = false;
		const startDrag = (e) => {
			if (!e.target.classList.contains("node-element-title")) {
				return;
			}
			isDragging = true;
			node.classList.add("dragging");
			currentPos.offsetX = e.clientX - node.offsetLeft;
			currentPos.offsetY = e.clientY - node.offsetTop;
			node.addEventListener("mousemove", drag, false);
			window.addEventListener("mouseup", endDrag);
		};
		const drag = (e) => {
			if(!isDragging) return;
			const newX = event.clientX - currentPos.offsetX;
			const newY = event.clientY - currentPos.offsetY;
			node.style.left = `${newX}px`;
			node.style.top = `${newY}px`;
			pos.x = newX;
			pos.y = newY;
			return;
		};
		const endDrag = () => {
			isDragging = false;
			node.classList.remove("dragging");
			node.removeEventListener("mousemove", drag);
			window.removeEventListener("mouseup", endDrag);
		};
		node.addEventListener('mousedown', startDrag);
	};

	const connectNodes = (parent, current) => {
		//console.log(parent.output, parent);
		
	}

	const commentNode = (data) => {
		const parentNode = getParentNode(data.parent);
		const onCreate = (e) => {
			data.element = e.target;
			makeDraggable(e.target, data.coord);
			if (!parentNode) return;
			connectNodes(parentNode, data);
		};
		return h("div", { class: "node-element", id: `comment-${data.id}`, style: `left: ${data.coord.x}px; top: ${data.coord.y}px`, onCreate}, [
				titleBar(data.title),
				h("div", { class: "node-element-content"},
					textInputs(data.input)
				),
			]
		);
	}

	const titleBar = (title) => {
		const onCreate = (e) => {};
		return h("div", { class: "node-element-title", onCreate }, [
			h("span", { class: "node-status-icon" }, h("i", { class: "icon-open"})),
			h("span", {}, title),
		]);
	};

	const textInputs = (inputs) => {
		return inputs.map(input => {
			switch(input.type) {
			case "TEXT":
				return textSnippets(input);
			case "NODE":
				let node = null;
				const el = jsonData.data.find(d => {
					return d.input.filter(i => i.id === input.nodeId).length > 0;
				});
				let refInput = el.input.find(i => i.id === input.nodeId);
				return textSnippets(refInput);
			default:
				throw `Unknown input type "${input.type}"`;
			}
		});
	};

	const setUpConnector = (e, data) => {
		e.target.onclick = (evt) => {
			const el = evt.target;
			const x = evt.clientX;
			const y = evt.clientY;
			console.log("click", el.offsetLeft, el.offsetTop)
			const html = h("svg", { width: 300, height: 300, class: "svg-connector", style: `top: ${x}px;left: ${y}px;`},
				h("rect", {width: 100, height: 100})
			);
			render(document.querySelector(".node-grid"), html)
		}
	}

	const textSnippets = (input) => {

		return h("div", { class: "node-element-input", id: input.id}, [
			h("span", { class: "node-input-dot"}),
			h("span", { class: "node-input-text-snippet"}, input.value),
			h("span", { class: "node-output-dot", onCreate: (e) => {
				setUpConnector(e)
			}}),
		]);
	};

	const getParentNode = (parentTag) => {
		if (!parentTag) {
			return null;
		}
		if (!jsonData) {
			throw Error("json data is missing");
		}
		return jsonData.data.find(entry => parentTag.id === entry.nodeId);
	};

	return {
		render: drawSvg,
	}
})();

const App2 = (() => {

	const init = () => {
		let root = document.getElementById("root");
		const box = HNode.render(root, getJsonData());
	};

	return {
		init,
	};
})();


window.addEventListener("load", () => {
	App2.init();
}, false) 