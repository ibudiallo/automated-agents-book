const Newsletter = (() => {
	const init = () => {
		startForm();
	};
	const fields = {
		url: null,
		email: null,
		fake: null,
	};

	const onSubmit = () => {
		const data = new FormData();
		data.append("EMAIL", fields.email.value);
		data.append(fields.fake.name, fields.fake.value);
		window.fetch(fields.url, {
			method: "post",
			body: data,
		})
		.then((res) => onSuccess(res))
		.catch(res => onError(res));
	};

	const onError = (res) => {
		console.log("error", res);
	};

	const onSuccess = (res) => {
		console.log("success", res)
	};

	const startForm = () => {
		const form = document.getElementById("mc-embedded-subscribe-form");
		fields.email = form[0];
		fields.fake = form[2];
		fields.url = form.action;
		const btn = form[1];
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			onSubmit();
		})
	}

	return { init };
})();

window.addEventListener("load", Newsletter.init, false);