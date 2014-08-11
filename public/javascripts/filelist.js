function deletefile(obj,name){
	var target = obj;
	$(target).parent().parent().hide();
	$.ajax({url:"/delete?name="+name,async:false});
}
