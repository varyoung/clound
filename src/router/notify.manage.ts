import Router from "vue-router";
import { RouteConfig } from "vue-router";


import { PublicNotice } from "@views/systemmanage/notiManage/publicNotice/pubilc.notice";
import { EmailsNotice } from "@views/systemmanage/notiManage/emailNotice/emails.notice";
import { MessageNotice } from "@views/systemmanage/notiManage/messageNotice/message.notice";


export const notifyRouter: RouteConfig[] = [
    {
        path: "notice",
        name: "站内公告",
        meta: {
            icon: "icon-quan-"
        },
        component: PublicNotice,
    },
    {
        path: "emaillnotice",
        name: "邮件通知",
        meta: {
            icon: "icon-quan-"
        },
        component: EmailsNotice,
    },
    {
        path: "messagenotice",
        name: "短信通知",
        meta: {
            icon: "icon-quan-"
        },
        component: MessageNotice,
    },
];