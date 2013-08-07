//function startLogin(request){
//	var i = 200;
//	(function(){
//		var con=postData("http://10.0.0.55/cgi-bin/do_login", "post", request.data);
//		var p=/^[\d]+$/;
//		if(i>0){
//			if(!p.test(con)){
//				setTimeout(arguments.callee,1000);
//				i--;
//			}else{
//				var lastInfo = getLastLoginInfo();
//				var map = getIPLocMap(new Array(lastInfo.ip),localStorage["ipdata"]);
//				var content ="上次登录IP："+lastInfo.ip+"　　　　　　　　";
//				content+= "上次登录地点："+map[lastInfo.ip];
//				var no_ok = window.webkitNotifications.createNotification(
//					'static/img/icon48.png', "自动登录成功：" +request.mode+"模式",content);
//				no_ok.show();
//				localStorage["uid"] = con;
//				setTimeout(function(){
//					no_ok.cancel();
//				}, 3000);
//			}
//		}else{
//			var no_fail = window.webkitNotifications.createNotification(
//				'static/img/icon48.png', "登录失败" ,"请检查网络连接！");
//			no_fail.show();
//			setTimeout(function(){
//				no_fail.cancel();
//			}, 3000);
//		}
//
//	})();
//}
//function loginOnce(){
//	if(localStorage["data"]&&localStorage["data"]!=""){
//		var lastInfo = getLastLoginInfo();
//		var map = getIPLocMap(new Array(lastInfo.ip),localStorage["ipdata"]);
//		var data = localStorage["data"];
//		var mode = (localStorage["drop"]===1)?"国内":"国际";
//		var con=postData("http://10.0.0.55/cgi-bin/do_login", "post", data);
//		var p=/^[\d]+$/;
//		var content ="上次登录IP："+lastInfo.ip+"　　　　　　　　";
//		content+= "上次登录地点："+map[lastInfo.ip];
//		if(p.test(con)){
//			var no_ok = window.webkitNotifications.createNotification(
//				'static/img/icon48.png', "自动登录成功："+mode+"模式" ,content);
//			no_ok.show();
//			localStorage["uid"] = con;
//			setTimeout(function(){
//				no_ok.cancel();
//			}, 3000);
//		}
//	}
//}
//function  doMessage(request, sender, sendResponse) {
//	if (request.message == "success"){
//		var lastInfo = request.lastinfo;
//		var map = getIPLocMap(new Array(lastInfo.ip),localStorage["ipdata"]);
//		var content =" 上次登录IP："+lastInfo.ip+"　　　　　　　　";
//		content+= "上次登录地点："+ map[lastInfo.ip];
//
//		var no = window.webkitNotifications.createNotification(
//			'static/img/icon48.png', "登录成功:"+request.mode+"模式." ,content);
//		no.show();
//		setTimeout(function(){
//			no.cancel();
//		}, 3000);
//	}else if(request.message == "start_login"){
//		var no = window.webkitNotifications.createNotification(
//			'static/img/icon48.png', "开始自动登录" ,"登录成功后将会提示您！如果您的帐号当前在别处登录，请手动注销再登录");
//		no.show();
//		setTimeout(function(){
//			no.cancel();
//		}, 3000);
//		startLogin(request);
//	}else if(request.message == "get_ipmap"){
//		var ipmap = getIPLocMap(request.ips,localStorage["ipdata"]);
//		sendResponse({"ipmap":ipmap});
//	}
//}
//
//if(chrome.extension.onMessage){
//	chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
//		doMessage(request, sender, sendResponse);
//	});
//}
//
//chrome.runtime.onStartup.addListener(function() {
//	if(getSettings().startuplogin=="true")
//		loginOnce();
//});
//chrome.idle.setDetectionInterval(3600);
//chrome.idle.onStateChanged.addListener(function(newstate){
//	if(newstate=="active"){
//		loginOnce();
//	}
//});
//
////安装完毕后在本地存储中添加选项字符串
//chrome.runtime.onInstalled.addListener(function(details) {
//	if(!localStorage["settings"]||localStorage["settings"]==""){
//		localStorage["settings"] = '{}';
//	}
//	var settings = getSettings();
//	var options = "startuplogin autologin activelogin".split(" ");
//	for (var i = 0; i < options.length; i++) {
//		settings[options[i]] =  (settings[options[i]]===undefined)?true:settings[options[i]];
//		localStorage["settings"] = JSON.stringify( settings);
//	}
//	var url = chrome.extension.getURL("/ipdata.dat");
//	if(url){
//		$.get(url,function(data){
//		localStorage["ipdata"] = data;
//		});
//	}
//
//});

chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('page_action.html', {
        'bounds': {
            'width': 340,
            'height': 380
        },
        'minHeight':380,
        'minWidth': 340,
        'maxHeight': 380,
        'maxWidth': 340

    });
});