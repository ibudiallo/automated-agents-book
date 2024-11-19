const getJsonData = () => {
	const JsonData = {
		version: "1.0",
		data: [{
			id: "0000001",
			type: "Comment",
			title: "Comment",
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
				x: 128,
				y: 195
			}
		},{
			id: "0000002",
			type: "Comment",
			title: "Comment",
			parent: {
				nodeId: "0000001"
			},
			input: [{
				id: "0001-0001-01235",
				type: "NODE",
				nodeId: "0001-0001-01234",
			}],
			coord: {
				x: 432,
				y: 195
			}
		}]
	};


	return JsonData;
}