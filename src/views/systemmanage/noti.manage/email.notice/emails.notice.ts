import  ElementUI  from "element-ui";
import { CloudTable } from "@components/cloudtable/table";
import { SetCol } from "@components/setcol/setcol";
import { TableConfigType } from "@store/table.type";
import { ModuleTitle } from "@components/title/module.title";
import Vue from "vue";
import Component from "vue-class-component";
import * as moment from "moment";
import { ListBaseClass } from "@views/base/base.class";
import { NOTICEEVENT } from "@store/notice.type";
import { mapGetters } from "vuex";
import { EventBus, CONSTANT } from "@utils/event";
import { NoticeServer } from "@server/notice";
import { AxiosResponse } from "axios";
import { ResType } from "server";

require("./emails.notice.styl");

@Component({
    name: "emailsnotice",
    components: {
        ModuleTitle,
        SetCol,
        CloudTable
    },
    template: require("./emails.notice.html"),
    computed: {
        ...mapGetters([
            "tableConfig",
            "emailTable",
        ])
    }
})


export class EmailsNotice extends ListBaseClass {
    // init computed
    public emailTable: EmailNoticeTableType;
    public tableConfig: TableConfigType;

    // init data
    public titles: string[] = ["邮件通知"];
    public ids: string[] = [];
    public filterData: SearchType = {
        key_word: "",
        send_date: [moment(new Date().getTime() - 24 * 60 * 60 * 1000).format("YYYYMMDD"), moment(new Date()).format("YYYYMMDD")],
        send_type: "",
        status: "",
    };
    public filter: SearchType = (<any>Object).assign({}, this.filterData);
    public emailnoticetableData: EmailNoticeColumnType[] = new Array<EmailNoticeColumnType>();

    // watch
    // lifecircle hook 
    created() {
        this.$store.dispatch(NOTICEEVENT.GETEMAILLIST, this.mergeData(this.tableConfig["emailtable"], this.filter));
        let that = this;

        let ListId = EventBus.register(CONSTANT.GETEMAILLIST, function (event: string, info: any) {
            console.log(that.emailTable);
            that.emailnoticetableData = (<any>Object).assign([], that.emailTable[that.tableConfig["noticetable"].page - 1]);

        });
    }

    destroyed() {
        // Aux.getIds().map((id, $idnex) => {
        //     EventBus.unRegister(id);
        // });
        // this.unwatch();
    }

    // init method
    search() {
        this.$store.dispatch(NOTICEEVENT.GETEMAILLIST, this.mergeData(this.tableConfig["emailtable"], this.filter));
    }

    // 填写
    write() {
        this.$router.push(`/SystemManagement/ReportManagement/emaillnotice/add`);
    }

    // 查看详情
    look(rowObj?: any) {
        if (rowObj) {
            this.$router.push(`/SystemManagement/ReportManagement/emaillnotice/look/${rowObj.row.id}`);
        }
    }
    reset() {
        this.filter = (<any>Object).assign({}, this.filterData);
        this.$store.dispatch(NOTICEEVENT.GETEMAILLIST, this.mergeData(this.tableConfig["emailtable"], this.filter));
    }

    handleSizeChange(val: number) {
        this.tableConfig.emailtable.page_size = val;
        this.$store.dispatch(NOTICEEVENT.GETEMAILLIST, this.mergeData(this.tableConfig["emailtable"], this.filter));

    }
    handleCurrentChange(val: number) {
        this.tableConfig.emailtable.page = val;
        this.$store.dispatch(NOTICEEVENT.GETEMAILLIST, this.mergeData(this.tableConfig["emailtable"], this.filter));

    }

    handleSelectionChange(options: any) {
        this.ids = [];
        options.map((item: EmailNoticeColumnType, $index: number) => {
            this.ids.push(item.id);
        });
    }

    del() {
        if (this.ids.length === 0) {
            this.$message({
                message: "请选择需要删除项",
                type: "warning"
            });
        } else {
            this.$confirm("删除后公告将无法恢复，您确定要删除吗？", "删除公告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                NoticeServer.delEmailRecord(this.ids).then((response: AxiosResponse<ResType>) => {
                    let res: ResType = response.data;
                    switch (res.status) {
                        case "suc":
                            ElementUI.Message({
                                message: "删除成功",
                                type: "success"
                            });
                            this.$store.dispatch(NOTICEEVENT.GETEMAILLIST, this.mergeData(this.tableConfig["emailtable"], this.filter));
                            break;
                        default:
                            break;
                    }
                });
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
        }
    }


  

    sortChange(opt: any) {

    }


}
export interface SearchType {
    key_word: string;
    send_date: Array<string>;
    send_type: string;
    status: string;
}

export interface EmailNoticeColumnType {
    id: string;
    object: string;
    receiver: string;
    send_date: string;
    send_type: string;
    sender: string;
    status: string;
}

export interface EmailNoticeTableType {
    [extra: string]: EmailNoticeColumnType[];
}