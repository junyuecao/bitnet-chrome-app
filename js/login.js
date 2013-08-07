form = document.forms[0];
var notifications = [];


function checkLoginResult(con){

  switch(con)

  {
    case "user_tab_error":
      showMsg("认证程序未启动");
      break;
    case "username_error":
      showMsg("用户名错误");
      form.uname.focus();
      break;
    case "non_auth_error":
      showMsg("您无须认证，可直接上网");
      break;
    case "password_error":
      showMsg("密码错误");
      form.pass.focus();
      break;
    case "status_error":
      showMsg("用户已欠费，请尽快充值。");
      break;
    case "available_error":
      showMsg("用户已禁用");
      break;
    case "ip_exist_error":
      showMsg("您的IP尚未下线，请等待2分钟再试。");
      break;
    case "usernum_error":
      showMsg("用户数已达上限");
      break; 
    case "online_num_error":
      showMsg("该帐号的登录人数已超过限额\n如果怀疑帐号被盗用，请联系管理员。");
      break;  
    case "mode_error":
      showMsg("系统已禁止WEB方式登录，请使用客户端");
      break;
    case "time_policy_error":
      showMsg("当前时段不允许连接");
      break;
    case "flux_error":
      showMsg("您的流量已超支");
      break;
    case "minutes_error":
      showMsg("您的时长已超支");
      break;
    case "ip_error":
      showMsg("您的IP地址不合法");
      break;
    case "mac_error":
      showMsg("您的MAC地址不合法");
      break;
    case "sync_error":
      showMsg("您的资料已修改，正在等待同步，请2分钟后再试。");
      break;
    default:
      showMsg("找不到认证服务器");
      break;    
  }   
}

function checkLogoutResult(con){

  switch(con){
    case "user_tab_error":
      showMsg("认证程序未启动");
      break;
    case "username_error":
      showMsg("用户名错误");
      form.uname.focus();
      break;
    case "password_error":
      showMsg("密码错误");
      form.pass.focus();
      break;
    case "logout_ok":
      showMsg("注销成功，现在可以点击登录，登录成功后将会有提示。");
      break;
    case "logout_error":
      showMsg("您不在线上");
      break;
    default:
      showMsg("找不到认证服务器");
      break;
  }
}

function do_login(storedPass) {

  var p=/(^[ ]+)|([ ]+$)/;

  
  var uname=form.uname.value.replace(p, "");

  var pass=form.pass.value.replace(p, "");

  if(uname=="")  {

    showMsg("请填写用户名");

    $("#username").get(0).focus();

    return;

  }

  

  if(pass=="")  {

    showMsg("请填写密码");

    $("#password").get(0).focus();

    return;

  }

  //密码md5加密传送
  
    var pass1=hex_md5(pass);

    var pass2=pass1.substr(8,16);


  

  var drop=($("#drop").get(0).checked==true)?1:0;

  var data="username="+uname+"&password="+pass2+"&drop="+drop+"&type=1&n=100";



  var con=postData("http://10.0.0.55/cgi-bin/do_login", "post", data);
  if(getSettings().autologin){
    if(con=="ip_exist_error"||con=="online_num_error"){
    if(chrome.extension.sendMessage){
         chrome.extension.sendMessage({
          "message":"start_login",
          "data":data,
          "username":uname,
          "password":pass2,
          "mode":(drop===1)?"国内":"国际"
        });
      }
    }
  }

  var p=/^[\d]+$/;
  if(p.test(con)){
      //登录成功
      var lastInfo = getLastLoginInfo();
      var saveContent = {
      "username" : uname,
      "password" : pass,
      "data" : data,
      "drop" : drop,
      "save" : form.save.checked?true:false,
      "uid" : con
    };

    if($("#save").get(0).checked){
      save(saveContent);
    }else{
      save(saveContent);
      removePass();
    }
      $("#infobtn").removeClass("disabled");
      var mode = (drop===1)?"国内":"国际";
      showSuccess("登录"+mode+"模式成功！");
      if(chrome.extension.sendMessage){
          chrome.extension.sendMessage({"message":"success","mode":mode,"lastinfo":lastInfo});
      }
      return;

  }
  checkLoginResult(con);


}



function force_logout(){

  if(!confirm("如果您的用户名有多个用户在线上，这些用户都将被强制下线，是否继续？"))

    return;

  var p=/(^[ ]+)|([ ]+$)/;
  var uname=form.uname.value.replace(p, "");

  var pass=form.pass.value.replace(p, "");

  if(uname==""){
    showMsg("请填写用户名");
    form.uname.focus();
    return;
  }
  if(pass==""){
    showMsg("请填写密码");
    form.pass.focus();
    return;
  }

  

  var drop=(form.drop.checked==true)?1:0;

  var data="username="+uname+"&password="+pass+"&drop="+drop+"&type=1&n=1";

  //alert(data);

  var con=postData("http://10.0.0.55/cgi-bin/force_logout", "post", data);

  //alert(con);
  checkLogoutResult(con);
}


function goto_services()
{
  // 自服务登录地址
  //http://10.0.0.55:8800/services1.php?user_login_name=******&user_password=*****&checkid=9538
  form.action="http://10.0.0.55/services.php";
  form.target="_blank";
  form.submit();
  //document.location.reload();
}

// 提示
// notification_test = window.webkitNotifications.createNotification(
//       'icon.png', 'Notification Title', 'Notification content...');
//     notification_test.ondisplay = function() { ... do something ... };
//     notification_test.onclose = function() { ... do something else ... };
//     notification_test.show();
$(function(){
  var user = getUser();
  var pass = getPass();
  var freeMode = storage['drop'];
  if(freeMode=='1'){
    form.drop.checked=true;
  }else{form.drop.checked=false;}
  var save = (storage['save']=="true")?true:false;
  $("#save").prop('checked', save);

  if(user!=""&&user!=undefined){
    form.uname.value=user;
  }
  if(pass!=""&&pass!=undefined){
    form.pass.value=pass;
  }
  $("#loginbtn").click(function(e){
    do_login();
    e.preventDefault();
  });
  $("#logoutbtn").click(function(e){
    force_logout();
    e.preventDefault();
  });
  $("#servicebtn").click(function(e){
    goto_services();
  });
  $("#closebtn").click(function(e){
    $("#msg_div").css("display","none");
  });
  $("#info_close_btn").click(function(e){
    $("#my_table").css("display","none");
  });
  var getInfo = function(e){
  var url = "http://10.0.0.55/user_info.php?uid="+ storage["uid"];
      $("#my_table").css("display","block");
    e.preventDefault();
  $.get(url,function(html){
      if(html!=""){
      var data=$($(html).get(5)).find("td:even").not(":first");
      
      var table = $("#info_table").find("td:odd");

      table.each(function(i,ele){
        ele.innerHTML = data[i].innerText;
      });
    }
  });
  };
  $("#infobtn").click(function(e){getInfo(e)});
  $("#info_refresh_btn").click(function(e){getInfo(e)});

});