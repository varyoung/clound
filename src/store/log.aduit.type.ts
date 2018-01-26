import { EventType } from "@store/store";


export const LOGADUITEVENT: EventType = {
    GETLOGAUDITLIST: "获取日志审计列表",
};

export interface LogAuditType {
    tableData: {
        [extra: string]: LogAuditTableType[];
    };
}

interface LogAuditTableType {
    email: string;
    ip: string;
    op_detail: string;
    op_ret: string;
    op_time: string;
    op_type: string;
    user: string;
}