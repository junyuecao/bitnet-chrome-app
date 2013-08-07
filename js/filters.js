'use strict';

/* Filters */

angular.module('srun3000.filters', []).
  filter('messageFilter', [function() {
        var messages = {
            "user_tab_error":"认证程序未启动",
            "username_error":"用户名错误",
            "non_auth_error":"您无须认证，可直接上网",
            "password_error":"密码错误",
            "status_error":"用户已欠费，请尽快充值。",
            "available_error":"用户已禁用",
            "ip_exist_error":"您的IP尚未下线，请等待2分钟再试。",
            "usernum_error":"用户数已达上限",
            "online_num_error":"该帐号的登录人数已超过限额,如果怀疑帐号被盗用，请联系管理员。",
            "mode_error":"系统已禁止WEB方式登录，请使用客户端",
            "time_policy_error":"当前时段不允许连接",
            "flux_error":"您的流量已超支",
            "minutes_error":"您的时长已超支",
            "ip_error":"您的IP地址不合法",
            "mac_error":"您的MAC地址不合法",
            "sync_error":"您的资料已修改，正在等待同步，请2分钟后再试。",
            "timeout":"连接超时",
            "logout_ok":"注销成功",
            "logout_error":"您不在线上"

    }
        return function(text) {
            if(/^[\d]+$/.test(text)){
                return "登录成功";
            }else{
                return messages[text]?messages[text]:"上网不涉密,涉密不上网";
            }
        }
  }]);
