const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const querystring = require('querystring');

exports.createCodepen = onRequest(async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(405).send('Method Not Allowed');
	}

	const formData = querystring.stringify({ data: req.body.data });

	try {
		const response = await fetch('https://codepen.io/pen/define', {
			method: 'POST',
			body: formData,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			redirect: 'manual',
		});

		const location = response.headers.get('location');

		if (location) {
			return res.status(200).send(location);
		} else {
			return res.status(500).send('Error: No location header in response');
		}
	} catch (error) {
		return res.status(500).send(`Error: ${error.message}`);
	}
});
