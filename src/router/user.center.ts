import Router from "vue-router";
import { RouteConfig } from "vue-router";



import { UserMessage } from "@views/usercenter/user.message";
import { UserPwd } from "@views/usercenter/user.pwd";



export const userCenterRouter: RouteConfig[] = [
    {
        path: "/usercenter/PersonalMessage",
        name: "个人信息",
        component: UserMessage,
        meta: {
            icon: "icon-gerenxinxi",
            permission: "Personal.Announcement.Check",
        }
    },
    {
        path: "/usercenter/ChangPwd",
        name: "修改密码",
        component: UserPwd,
        meta: {
            icon: "icon-xiugaimima",
            permission: "Personal.Announcement.Modify",
        }
    },
];