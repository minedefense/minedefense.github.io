function HTTPGetSync(url){
	var request = new XMLHttpRequest();
	request.open('GET', url, false);  // `false` makes the request synchronous
	request.send(null);

	if (request.status === 200){
		return request.responseText;
	}
}