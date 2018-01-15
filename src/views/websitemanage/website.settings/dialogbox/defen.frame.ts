import { FormType } from "@views/websitemanage/website.settings/website.settings.attchement";
import { MywebsiteServer } from "@server/mywebsite";
import { CustomTags } from "@components/customtags/custom.tags";
import Vue from "vue";
import Component from "vue-class-component";
import { UserServer } from "@server/user";
import { ResType } from "server";
import { FormRuleType, FromValidator } from "@utils/form.validator";
import { AxiosResponse } from "axios";


require("./defen.frame.styl");
@Component({
    name: "denfenframe",
    template: require("./defen.frame.html"),
    props: {
        dialogVisible: Boolean,
        uid: {
            type: String
        },
        data: Object,
    },
    components: {
        CustomTags
    }
})
export class DenfenFrame extends Vue {
    // init props
    public uid: string;
    public data: FormType;

    // init data
    public form: DenfenType = {
        waf_hotlink_white: [""],
    };
    public defalutUrl: Array<string>;
    
    created() {
        this.defalutUrl = this.data.waf_hotlink_white;
        console.log(this.defalutUrl);
    }
    getTags(tags: string[]) {
        this.form.waf_hotlink_white = tags;
    }

    submit(formName: string) {
        let id = this.$route.params.id;
        let params = {
            sid: id,
            waf_hotlink_white: this.form.waf_hotlink_white,
        };
        MywebsiteServer.BWlist(params).then( (response: AxiosResponse<ResType>) => {
            let res: ResType = response.data;
            // Do something with response data
            switch (res.status) {
                // "suc" | "error" | "red"
                case "suc":
                    this.$message({
                        type: "success",
                        message: "设置成功!"
                    });
                    this.cancel();
                    break;
                case "error":
                    this.$message({
                        type: "error",
                        message: res.message
                    });
                    break;
                case "red":
                    break;
            }
        });
    }

    cancel() {
        this.$emit("close", false);
    }
}

export interface DenfenType {
    waf_hotlink_white: Array<string>;
}