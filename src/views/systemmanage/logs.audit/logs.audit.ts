import { mapGetters } from "vuex";
import { CloudTable } from "@components/cloudtable/table";
import { SetCol } from "@components/setcol/setcol";
import { TableConfigType } from "@store/table.type";
import { ModuleTitle } from "@components/title/module.title";
import Vue from "vue";
import Component from "vue-class-component";
import { ListBaseClass } from "@views/base/base.class";
import { LogAuditType, LOGADUITEVENT, LogAuditsTableType, } from "@store/log.aduit.type";




require("./logs.audit.styl");

@Component({
    name: "logsaudit",
    components: {
        ModuleTitle,
        SetCol,
        CloudTable
    },
    template: require("./logs.audit.html"),
    computed: {
        ...mapGetters([
            "tableConfig",
            "logAuditTableData",
        ]),

    }
})


export class LogsAudit extends ListBaseClass {
    // init computed
    public logAuditTableData: LogAuditsTableType;
    public tableConfig: TableConfigType;

    // init data
    public titles: string[] = ["日志审计"];
    public Aux = new this.Auxiliary<string>();
    public filterData: SearchType = {
        detail: "",
        send_date: [this.moment(new Date().getTime() - 24 * 60 * 60 * 1000).format("YYYYMMDD"), this.moment(new Date()).format("YYYYMMDD")],
        ip: "",
        op_result: "",
        op_type: "",
        user: "",
        sort_time: "1",
    };
    public filter: SearchType = (<any>Object).assign({}, this.filterData);
    // 选择当前时间
    public logAuditTableColumnData: LogsAuditColumnType[] = [];

    // 下载
    public ids: string[] = [];
    // watch
    public unwatch: Function = () => { };
    public value1: string = "";
    public value2: string = "";

    // 操作类型项
    public op_typeOptions: Array<DomainType> = [
        {
            value: "",
            label: "全部"
        }, {
            value: "认证管理",
            label: "认证管理"
        }, {
            value: "运营分析",
            label: "运营分析"
        }, {
            value: "攻击日志",
            label: "攻击日志"
        }, {
            value: "网站管理",
            label: "网站管理"
        }, {
            value: "统计报告",
            label: "统计报告"
        }, {
            value: "运维管理",
            label: "运维管理"
        }, {
            value: "用户管理",
            label: "用户管理"
        }, {
            value: "组织机构管理",
            label: "组织机构管理"
        }, {
            value: "日志审计",
            label: "日志审计"
        }, {
            value: "通知管理",
            label: "通知管理"
        }];
    public value: string = "";

    // lifecircle hook 
    created() {
        // 获取列表
        this.$store.dispatch(LOGADUITEVENT.GETLOGAUDITLIST, this.mergeData(this.tableConfig["logautdittable"], this.filter));
        let that = this;
        let ListId = this.EventBus.register(LOGADUITEVENT.GETLOGAUDITLIST, function (event: string, info: any) {
            let data = [];
            data = (<any>Object).assign([], that.logAuditTableData[that.tableConfig["logautdittable"].page - 1]);
            that.logAuditTableColumnData = data[0].data;
        });
        this.Aux.insertId(ListId);
    }

    destroyed() {
        this.Aux.getIds().map((id: any, $idnex: any) => {
            this.EventBus.unRegister(id);
        });
    }

    // init method
    search() {
        this.$store.dispatch(LOGADUITEVENT.GETLOGAUDITLIST, this.mergeData(this.tableConfig["logautdittable"], this.filter));
    }

    reset() {
        this.filter = (<any>Object).assign({}, this.filterData);
        this.$store.dispatch(LOGADUITEVENT.GETLOGAUDITLIST, this.mergeData(this.tableConfig["logautdittable"], this.filter));
    }

    handleSizeChange(val: number) {
        this.tableConfig.logautdittable.page_size = val;
        this.$store.dispatch(LOGADUITEVENT.GETLOGAUDITLIST, this.mergeData(this.tableConfig["logautdittable"], this.filter));
    }
    handleCurrentChange(val: number) {
        this.tableConfig.logautdittable.page = val;
        this.$store.dispatch(LOGADUITEVENT.GETLOGAUDITLIST, this.mergeData(this.tableConfig["logautdittable"], this.filter));
    }
    sortChange(opt: any) {
        if (opt.order === "descending") {
            this.filter.sort_time = "0";
        } else {
            this.filter.sort_time = "1";
        }
        this.$store.dispatch(LOGADUITEVENT.GETLOGAUDITLIST, this.mergeData(this.tableConfig["logautdittable"], this.filter));
    }


    // 选中项目
    handleSelectionChange(options: any[]) {
        this.ids = [];
        options.map((item: LogsAuditColumnType, $index: number) => {
            this.ids.push(item.id);
        });
    }
 
    // 跳转方法同统一
    handle(type: "download", rowObj?: any) {
        if (type === "download") {
            if (this.ids.length === 0) {
                this.downLoadAll();
            } else {
                this.downLoadChoose();
            }
        }
    }

    // 下载
    downLoadChoose() {
        this.exportFile(`/api/v20/syslog/export_log/?ids=[${this.ids}]${this.objToUrl(this.filter)}`);
    }
    downLoadAll() {
        let data = this.filter;
        this.exportFile(`/api/v20/syslog/export_log/?${this.objToUrl(this.filter)}`);
    }

}

export interface DomainType {
    value: string;
    label: string;
}
export interface SearchType {
    detail: string;
    ip: string;
    op_result: string;
    op_type: string;
    user: string;
    send_date: Array<string>;
    sort_time: string;
}

export interface LogsAuditColumnType {
    email: string;
    ip: string;
    op_detail: string;
    op_ret: string;
    op_time: string;
    op_type: string;
    user: string;
    id: string;
}