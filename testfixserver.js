var fix = require("./fix");
var sys = require("sys");

const FIX40 = {version: "FIX.4.0",
		headers:["8","9","35","49","56","115?","128?","90?","91?","34","50?","142?","57?","143?","116?","144?","129?","145?","43?","97?","52","122?","212?","347?","369?","370?"],
		trailers:["39?","89?","10"]};
const FIX41 = {version: "FIX.4.1",
		headers:["8","9","35","49","56","115?","128?","90?","91?","34","50?","142?","57?","143?","116?","144?","129?","145?","43?","97?","52","122?","212?","347?","369?","370?"],
		trailers:["39?","89?","10"]};
const FIX42 = {version: "FIX.4.2",
		headers:["8","9","35","49","56","115?","128?","90?","91?","34","50?","142?","57?","143?","116?","144?","129?","145?","43?","97?","52","122?","212?","347?","369?","370?"],
		trailers:["39?","89?","10"]};
const FIX43 = {version: "FIX.4.3",
		headers:["8","9","35","49","56","115?","128?","90?","91?","34","50?","142?","57?","143?","116?","144?","129?","145?","43?","97?","52","122?","212?","347?","369?","370?"],
		trailers:["39?","89?","10"]};
const FIX44 = {version: "FIX.4.4",
		headers:["8","9","35","49","56","115?","128?","90?","91?","34","50?","142?","57?","143?","116?","144?","129?","145?","43?","97?","52","122?","212?","347?","369?","370?"],
		trailers:["39?","89?","10"]};


fix.createServer(FIX40, function(session){
	//session.addListener("connect", function(){ sys.puts("Connected"); });
	session.addListener("data",function(data){ 
		sys.puts(fix.clients.length); 
	});
}).listen(1234);
