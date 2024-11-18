const getJsonData = () => {
	const JsonData = {
		version: "1.0",
		data: [{
			id: "0000001",
			type: "Comment",
			title: "Comment",
			content: "Here we make a long comment",
			parent: null,
			input: [{
				id: "0001-0001-01234",
				type: "TEXT",
				value: "Here we make a long comment",
			}],
			output: {
				type: "INPUT_VALUE",
				value: {
					id: "0001-0001-01234"
				},
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
			parent: {
				nodeId: "0000001"
			},
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