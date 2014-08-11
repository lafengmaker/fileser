/** list root file and folder */
var fs=require("fs"),
 mime=require('./mime').mime,
 path = require('path');
exports.listfile = function(req, res){
	var filename=getfilepath(req);
	console.log("reqfilename:"+filename);
	if(filename.indexOf('deletefiles')>0){
		console.log('Invalid File path');
		res.send('Invalid File path');
	}
	fs.exists(filename,function(exists ){
		if(exists){		
			var stat=fs.statSync(filename);
			if(stat.isDirectory(filename)){
				//fs.readdir(filename,function(errors,files){
				var files = fs.readdirSync(filename).map(function(v) {
					return { name:v, time:fs.statSync(path.join(filename,v)).mtime.getTime()}; 
               					}).sort(function(a, b) { return a.time - b.time; }).map(function(v) { 
               		return v.name;
				 });
				var showType=req.params.showType;
				files=files.filter(function(file){
					var name=path.normalize(file);
					if(name.indexOf("deletefiles")==-1){
						return file;
					}
				});
				if('img'==showType){
					files=files.filter(function(file){
						var ext=path.extname(file);
						if('.jpg'==ext||'.jpeg'==ext||'.gif'==ext||'.png'==ext){
							return file;
						}
				 }); 
					res.render('images',{'title':'照片墙','max':(files.length/10+1)});
				}else{
					var li=convertfiletoMyFile(filename,files);
					var q=req.query.name;
					if(!q){
						q='/'
					}
					console.log(q);
					res.render('filelist', { "dirname":q,title:'文件列表','myfiles':li});
				}
				
			}else{
				//res.send('This is a file'+filename);
				fs.readFile(filename,function(error,data){
					var contenttype=mime.lookupExtension(path.extname(filename));
					if('text/plain'==contenttype || !contenttype){
						filename=path.basename(filename);	
						res.render('read', { 'title':filename,'data':data});
					}else{
						var statf=fs.statSync(filename);
						res.writeHead(200,{'content-Type':contenttype,
								'Content-Length':statf["size"],
								'Server':'NodeJs('+process.version+')'});
						res.write(data,'binary');
						res.end;
					}
								
					
				});
				
			}
			
		}else{
			console.log('file not exists');
			res.send('file not exists !');
		}
	})
	//console.log(app.get('fileroot'));
	
	
};
exports.ajaxfiles=function(req, res){
	var filename=getfilepath(req);
	var jsons;
	var index=req.query.page;
	if(!sessionfile){
	var files = fs.readdirSync(filename).map(function(v) {
					return { name:v, time:fs.statSync(path.join(filename,v)).mtime.getTime()}; 
               					}).sort(function(a, b) { return a.time - b.time; }).map(function(v) { 
					return v.name;
				 }).filter(function(file){
						var ext=path.extname(file);
						if('.jpg'==ext||'.jpeg'==ext||'.gif'==ext||'.png'==ext){
							return file;
						}
				 });
		files=converImg(filename,files);
        if(files && files.length>0){
        jsons=new Array(files.length);
		files.forEach(function(f,index){
			jsons[index]=f.toJson();
		});
		
	}
         req.session.slist = jsons;
	}

	var sessionfile=req.session.slist;
	if(!index){
		index=1;
	}
	var html=""
	var end=index*10;
	var start=end-10;
	
	if(end<sessionfile.length){
		for(var j=start;sessionfile.length;j++){
			if(j<end){
				html+="<div class='item'> <img src='/"+sessionfile[j].image+"' width='"+sessionfile[j].width+"' height='"+sessionfile[j].height+"'> </div>";
			}else{
				break;
			}
		}
	}
	res.send(html);
        res.end;

}

function getfilepath(req){
	var fileroot=global.filedir;
	var filename=req.query.name;
	if(!filename){
		filename="";
	}
	return path.join(fileroot,filename);
}
function convertfiletoMyFile(parent,files){
	var fileroot=global.filedir;
	var length=files.length;
	var list= new Array(length);
	var myFile=require('./myFile.js');
	files.forEach(function(val,index){		
		var stat=fs.statSync(path.join(parent,val));
		if(stat.isDirectory(val)){
			val=path.basename(val)+"/";
		}else{
			val=path.basename(val);
		}
		href=path.relative(fileroot,path.join(parent,val));	
		var myf=new myFile(val,href,stat["size"],192,192);
		list[index]=myf;
	});
	return list;
}
function converImg(parent,files){
	var fileroot=global.filedir;
	var length=files.length;
	var list= new Array(length);
	var myFile=require('./myFile.js');
	files.forEach(function(val,index){
		href=path.relative(fileroot,path.join(parent,val));
		var sizeOf=require('image-size');
		var dimensions=sizeOf(path.join(parent,val));
		var num=dimensions.width/192;		
		var myf=new myFile(val,href,0,192,(dimensions.height/num));
		list[index]=myf;		
	});
	return list;
}
exports.deletefile = function(req, res){
	var filename=getfilepath(req);
	var f1name=path.basename(filename)+getTimestr();
	util=require('util');
	var f2name=path.join(global.filedir,"deletefiles",f1name);
	console.log(filename);
	console.log(f2name);
	
	var readStream=fs.createReadStream(filename);
	var writeStream=fs.createWriteStream(f2name);
	//util.pump(readStream, writeStream, function(){
	//	fs.unlink(filename);
	//});
	readStream.pipe(writeStream);
	readStream.on('end',function(){
		fs.unlink(filename);
	});
	res.send('ok');
	res.end;
}
function toStr(num){
	if(num<10){
		num="0"+num;
	}else{
		num=num+"";
	}
	return num;
}
function getTimestr(){
	var today=new Date();
	var y=today.getFullYear();
	var m=today.getMonth();
	m++;
	var d=today.getDate();
	var h=today.getHours();
	var mi=today.getMinutes();
	var s=today.getSeconds();
	var ms=today.getMilliseconds();
	return y+""+toStr(m)+toStr(d)+toStr(h)+toStr(mi)+toStr(s)+ms;
}



