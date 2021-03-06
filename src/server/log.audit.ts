import { Restful } from "@server/index";

class LogAudit extends Restful {
    constructor() {
        super();
    }

    public getLogAuditList(opt: {
        detail?: string;
        end_date?: string;
        ip?: string;
        op_result?: string;
        op_type?: string;
        start_date?: string;
        user?: string;
    }) {
        return this.get({
            url: `/api/v20/syslog/op_log/`,
            params: opt
        });
    }
}

export const LogAuditService = new LogAudit();