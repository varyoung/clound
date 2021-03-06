import { RichTextEditor } from "@components/richtexteditor/editor";
import { ModuleTitle } from "@components/title/module.title";
import { ResType } from "@server/index";
import { AxiosResponse } from "axios";
import Component from "vue-class-component";
import { mapGetters } from "vuex";
import { FormRuleType } from "@utils/form.validator";
import { NoticeServer } from "@server/notice";
import {  DiplomaBaseClass } from "@views/base/base.class";


require("./public.notice.operation.styl");
@Component({
    name: "publicnoiceoperation",
    template: require("./public.notice.operation.html"),
    props: {
    },
    computed: {
        ...mapGetters([
            "websiteEdit"
        ])
    },
    components: {
        ModuleTitle,
        RichTextEditor
    }
})

export class PublicNoiceOperation extends DiplomaBaseClass {
    // init props

    // init computed


    // init data
    public Aux = new this.Auxiliary<string>();
    public form: PublicNoticeFormType = {
        content: "",
        title: "",
    };

    // 标题
    public titles: string[] = ["写公告"];

    // 表单验证
    public rules: FormRuleType = {
        title: [
            { required: true, message: "请填写公告标题", trigger: "blur" },
            { min: 1, max: 40, message: "不符合字符规范，字符长度1-40字符", trigger: "blur" }
        ],
        content: [
            { required: true, message: "请添加公告内容", trigger: "blur" },
            { min: 1, max: 1000, message: "不符合字符规范，字符长度1-1000字符", trigger: "blur" }

        ],
    };



    // init lifecircle hook
    created() {
        let that = this;
        let id = this.$route.params.id;
        if (id) {
            // this.$store.dispatch(MYWEBSITEEVENT.GETWEBEDIT, { website_id: id, operation: this.operation });
        }
        let eventId = this.EventBus.register(this.CONSTANT.GETWEBEDIT, function (event: string, info: any) {

        });
        this.Aux.insertId(eventId);
    }

    destroyed() {
        this.Aux.getIds().map((id, $index) => {
            this.EventBus.unRegister(id);
        });
    }

    // init methods

    submitForm(formBasic: string) {
        let temp: any = this.$refs.noticeform;
        let flag: boolean = false;
        temp.validate((valid: any) => {
            flag = valid;
        });
        if (flag) {
            NoticeServer.addNotice(this.form).then((response: AxiosResponse<ResType>) => {
                let res: ResType = response.data;
                switch (res.status) {
                    case "suc":
                        this.$notify({
                            title: "提示",
                            message: "公告填写成功",
                            type: "success"
                        });
                        this.$router.push("/SystemManagement/ReportManagement/notice");
                        break;
                    case "error":

                        break;
                    default:
                        break;
                }
            });
        }
    }

    content(val: string) {
        this.form.content = val;
    }

}


export interface PublicNoticeFormType {
    content: string;
    title: string;
}