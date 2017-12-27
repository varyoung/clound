import Component from "vue-class-component";
import Vue from "vue";
import { mapGetters } from "vuex";
import ElementUI from "element-ui";


import { ModuleTitle } from "@components/title/module.title";
import { UserMessageType, USER, UserCenterType } from "@store/user.center.type";
import { OrganizationTreeType, Organization } from "@store/organization.type";
import { FromValidator, FormRuleType } from "@utils/form.validator";
import { AddOrganizationFrame } from "@views/usermanage/dialogbox/add.organization.frame";
import { TissueTree } from "@components/tissuetree/tree";
import { UserServer } from "@server/user";
import { ResType } from "server";
import { AxiosResponse } from "axios";
import { vm, EventBus, CONSTANT } from "@utils/event";
import { Auxiliary } from "@utils/auxiliary";

const Aux = new Auxiliary<string>();
interface RoleType {
    name: string;
    role_id: number;
}

require("./operation.styl");
@Component({
    name: "useroperation",
    template: require("./operation.html"),
    props: {
        operation: {
            type: String,
            default: "add"
        }
    },
    computed: {
        ...mapGetters([
            "personInfo"
        ])
    },
    components: {
        ModuleTitle, AddOrganizationFrame, TissueTree
    }
})
export class UserOperation extends Vue {
    // init props
    public dialogVisible: boolean = false;
    public operation: "add" | "editor";

    // init computed
    public personInfo: UserCenterType;

    // init data
    public form: UserMessageType = {
        uid: "0",
        user_name: "",
        pwd: "",
        role: "",
        role_id: "",
        cperson: "",
        ctime: "",
        state: "",
        company: "",
        phone: "",
        email: "",
        remark: "",
        used_domain_num: "",
        max_domain_num: "",
        waf_enable: "1",
        ads_enable: "1",
        mirror_enable: "1",
        cdn_enable: "1",
        expiry_date: "",
    };
    public roles: Array<RoleType> = new Array<RoleType>();
    public rules: FormRuleType = {
        user_name: [
            { required: true, message: "真实姓名不能为空", trigger: "blur" },
            { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
        ],
        phone: [
            { required: true, message: "手机号码不能为空", trigger: "blur" },
            { validator: FromValidator.tel, trigger: "blur", message: "请填写正确手机号码" }
        ],
        email: [
            { required: true, message: "邮箱不能为空", trigger: "blur" },
            { validator: FromValidator.email, trigger: "blur", message: "请填写正确邮箱" }
        ],
        company: [
            { required: true, message: "企业名称不能为空", trigger: "blur" },
        ],
        pwd: [
            { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        expiry_date: [
            { required: true, message: "请填写到期日期", trigger: "blur" },
        ]
    };



    // init lifecircle hook
    created() {
        let that = this;
        let id = this.$route.params.id;
        if (id) {
            this.$store.dispatch(USER.GETOTHERUSER, { uid: id, operation: this.operation });
        } else {
            this.form = this.personInfo.init;
        }
        let eventId = EventBus.register(CONSTANT.USERMESSAGE, function (event: string, info: any) {
            that.form = that.personInfo[id];
        });
        Aux.insertId(eventId);

        UserServer.getUserRole().then((response: AxiosResponse<ResType>) => {
            let res: ResType = response.data;
            switch (res.status) {
                case "suc":
                    this.roles = res.data;
                    break;
                default:
                    break;
            }
        });
    }

    destroyed() {
        Aux.getIds().map((id, $index) => {
            EventBus.unRegister(id);
        });
    }



    // init methods
    importNode(node: OrganizationTreeType) {
        this.form.company = node.name;
        this.dialogVisible = false;
    }
    addOrganization() {
        this.dialogVisible = true;
    }
    close() {
        this.dialogVisible = false;
    }
    // 'formbasic','formserver'
    submitForm(formBasic: string, formServer: string) {
        let temp: any = this.$refs[formBasic];
        this.form.role_id = this.form.role;
        temp.validate((valid: any) => {
            if (valid) {
                switch (this.operation) {
                    case "add":
                        UserServer.addUser(this.form).then((response: AxiosResponse<ResType>) => {
                            let res: ResType = response.data;
                            switch (res.status) {
                                case "suc":
                                    ElementUI.Message({
                                        message: "添加用户成功",
                                        type: "success"
                                    });
                                    break;
                                default:
                                    break;
                            }
                        });
                        break;
                    case "editor":
                        UserServer.editUser(this.form).then((response: AxiosResponse<ResType>) => {
                            let res: ResType = response.data;
                            switch (res.status) {
                                case "suc":
                                    ElementUI.Message({
                                        message: "编辑用户成功",
                                        type: "success"
                                    });
                                    break;
                                default:
                                    break;
                            }
                        });
                    default:
                        break;
                }

            } else {
                ElementUI.Message({
                    message: "表单格式不正确",
                    type: "error"
                });
                return false;
            }
        });
    }

    back() {
        this.$router.go(-1);
    }
}