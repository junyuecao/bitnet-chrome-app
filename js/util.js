var storage = chrome.storage.local;
function getSettings(){
	var tmp =  storage["settings"];
	if(tmp)
		return JSON.parse(tmp);
	else{
		return {};
	}
}
function getUser(){
	if(storage["username"])
		return storage["username"];
}
function saveUser(username){
	storage['username']=username;
}
function savePass(password){
	storage['password']=password;
}
function getPass(){
	if(storage["password"])
		return storage["password"];
}
function save(obj){
	for (var i in obj) {
		storage[i] = obj[i];
	}
}
function removePass(){
	delete storage['password'];
}
function showMsg (msg) {
	var $msg_div = $("#msg_div");
	var $msg = $("#msg");
	$msg_div.removeClass("alert-success");
	$msg.text(msg);
	$msg_div.css("display","block");
}
function showSuccess(msg){
	var $msg_div = $("#msg_div");
	var $msg = $("#msg");
	$msg_div.addClass("alert-success");
	$msg.text(msg);
	$msg_div.css("display","block");
}
/**ip和地点映射
 ips 数组
 data 字符串
*/
function endIsBigger(beginIP,endIP){
	beginIP = beginIP.trim();
	endIP = endIP.trim();
	var begin = beginIP.split(".");
	var end = endIP.split(".");
	for (var i = 0; i < begin.length; i++) {
		if(parseInt(begin[i], 10)>parseInt(end[i],10)){
			return false;
		}
	}
	return true;
}

function contains(ip,min,max){
	return endIsBigger(min,ip)&&endIsBigger(ip,max);
}
function getIPLocMap(ips,data){
	var ipmap = {};//ip-地点映射表
	var ipsegs = [];//所有的IP段
	var ipdata = data.trim();
	var ipsegStrings = ipdata.trim().split("||");

	(
		function(){
			for (var i = 0; i < ipsegStrings.length; i++) {
				var ipseg = {};
				var ipsegArray = ipsegStrings[i].split("|");
				ipseg.beginIP = ipsegArray[0].trim();
				ipseg.endIP = ipsegArray[1].trim();
				ipseg.loc = ipsegArray[2].trim();
				ipsegs.push(ipseg);
			}
		})();

		(function (){
			for (var i = 0; i < ips.length; i++) {

				if(!ipmap[ips[i]]){
					for (var j = 0; j < ipsegs.length; j++) {
						if(contains(ips[i],ipsegs[j].beginIP,ipsegs[j].endIP)){
							ipmap[ips[i]] = ipsegs[j].loc;
							break;
						}
					}
				}
			}
		})();
		return ipmap;
	}


function postData(theAction,theMethod,theData){
	var thePost = (window.XMLHttpRequest)? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	thePost.onreadystatechange = function(){

	}
	switch(theMethod)
	{
		case "post":
		thePost.open("POST",theAction,false);
		thePost.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		thePost.send(theData);
		break;
		case "get":
		thePost.open("GET",theAction+"?"+theData,false);
		thePost.send("");
		break;
		default:
		return "";
	}
	return thePost.responseText;
}
function getLastLoginInfo(){
	var infos = {};
	var cols = ["ip","login_time","logout_time","client","traffic_in","traffic_out","free_in","free_out","time","fee"];
	var username = storage["username"];
	var password = storage["password"];
	var serviceLoginUrl = "http://10.0.0.55:8800/services1.php";
	var theData = "user_login_name="+username+"&user_password="+password+"&checkid=9538";
	if(postData(serviceLoginUrl,"get",theData)!=""){
		var table = $(postData("http://10.0.0.55:8800/services.php","get","action=detail")).eq(11);
		var firstLineCells = table.find("tr").eq(4).find("td");
		firstLineCells.each(function(i,e){
			infos[cols[i]] = $(this).text();
		});
	}
	return infos;
}