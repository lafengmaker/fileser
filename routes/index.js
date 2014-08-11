/* GET home page. */

exports.index = function(req, res){
	var diskspace = require('diskspace');	
	diskspace.check(global.filedir, function(error,total, free, status){
		console.log(total);
		var contentper=getRound(total-free,total);
		var n=1024*1024*1024;
		total=getRound(total,n);
		free=getRound(free,n)
		console.log(total);
		console.log(free);
		res.render('index', { total: total,free:free,title:'文件服务器',contentper:contentper});
	});
};
exports.download = function(req, res){
	 var path = require("path");
	 var pathname=req.query.name;
	 //var realPath = path.join("assert",pathname );
	 pathname='assert/'+pathname;
	 //console.log(realPath);
	 res.download(pathname);
};
function getRound( num,dvidenum){
	return Math.round((num*100/dvidenum))/100;
}

