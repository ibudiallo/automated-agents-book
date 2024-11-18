const getJsonData = () => {
	const JsonData = {
		version: "1.0",
		data: [{
			id: "0000001",
			type: "Comment",
			title: "Comment",
			content: "Here we make a long comment",
			parent: null,
			input: {
				type: "Value",
				value: null,
			},
			output: {
				type: "VALUE",
				value: null,
			},
			coord: {
				x: 10,
				y: 20
			}
		},{
			id: "0000002",
			type: "Comment",
			title: "Comment",
			content: "Enter comment here",
			parent: null,
			input: {
				type: "NODE",
				nodeId: ["0000001"]
			},
			coord: {
				x: 200,
				y: 150
			}
		}]
	};
	return JsonData;
}