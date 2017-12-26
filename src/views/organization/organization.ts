import Component from "vue-class-component";
import Vue from "vue";
import { mapGetters } from "vuex";
import ElementUI from "element-ui";



import { ModuleTitle } from "@components/title/module.title";
import { TissueTree } from "@components/tissuetree/tree";
import { TipBox } from "@views/organization/dialogbox/tip.box";
import { vm, ORGANIZATIONEVENT, FormRuleType } from "@utils/index";
import { OrganizationTreeType, Organization, MessageType, ORGANIZATION } from "@store/organization.type";
import { OrganizationServer } from "@server/organization";
import { ResType } from "server";



require("./organization.styl");
@Component({
    name: "organization",
    template: require("./organization.html"),
    watch: {
        filterText(val: any) {
            let temp: any = this.$refs.tree;
            temp.filter(val);
        }
    },
    components: {
        ModuleTitle, TissueTree, TipBox
    },
    computed: {
        ...mapGetters([
            "OrganizationMessage"
        ])
    }
})
export class OrganizationComponent extends Vue {
    // init data
    public pid: string = "";
    public dialogVisible: boolean = false;
    public create: boolean = false;
    public form: MessageType = {
        desc: "",
        id: "",
        name: "",
        // pid: "",
        sname: ""
    };

    public rules: FormRuleType = {
        name: [
            { required: true, message: "请输入组织名称", trigger: "blur" },
        ],
        sname: [
            { required: true, message: "请输入组织简称", trigger: "change" }
        ]
    };
    // init computed
    public OrganizationMessage: Organization;


    // lifecycle hook
    created() {
        vm.$on(ORGANIZATIONEVENT.GETORGANIZATION, (id: string) => {
            this.form = this.OrganizationMessage[id];
        });
    }
    destroyed() {
        vm.$off(ORGANIZATIONEVENT.GETORGANIZATION);
    }

    // init methods
    addNode(opt: any) {
        this.pid = opt.id;
        this.dialogVisible = true;
    }

    delNode(opt: any) {
        ElementUI.MessageBox.confirm("确定要删除嘛？", "提示").then(() => {
            OrganizationServer.delOrganization(opt.id).then((res: ResType & any) => {
                switch (res.status) {
                    case "suc":
                        ElementUI.Message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.$store.dispatch(ORGANIZATION.INITORGANIZATIONTREE);
                        break;

                    default:
                        break;
                }
            });
        }).catch(() => {

        });
    }

    clickNode(data: OrganizationTreeType) {
        this.$store.dispatch(ORGANIZATION.ADDORGANIZATIONMESSAGE, { id: data.id });
    }

    close() {
        this.dialogVisible = false;
    }

    onSubmit(form: string) {
        let temp: any = this.$refs[form];
        temp.validate((valid: any) => {
            if (valid) {
                OrganizationServer.editOrganizationInfo((<any>Object).assign({}, this.form)).then((res: ResType & any) => {
                    switch (res.status) {
                        case "suc":
                            ElementUI.Message.success(res.message);
                            this.create = false;
                            break;
                        default:
                            break;
                    }
                });
            } else {
                console.log("error submit!!");
                return false;
            }
        });
    }

    resetForm(form: string) {
        let temp: any = this.$refs[form];
        temp.resetFields();
    }
}