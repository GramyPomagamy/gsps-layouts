F13::
    HttpGet("http://localhost:9090/makeHighlight")
Return

F14::
    HttpGet("http://localhost:9090/switchToIntermission")
Return





HttpGet(URL) {
	static req := ComObjCreate("Msxml2.XMLHTTP")
	req.open("GET", URL, false)
	req.SetRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT")
	req.send()
}