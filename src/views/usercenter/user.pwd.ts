import Component from "vue-class-component";
import Vue from "vue";
import { mapGetters } from "vuex";
import ElementUI from "element-ui";


import { ModuleTitle } from "@components/title/module.title";
import { UserCenterType, UserMessageType } from "@store/user.center.type";
import { FormRuleType, FromValidator } from "@utils/index";
import { UserServer } from "@server/user";
import { ResType } from "@server/index";




require("./user.pwd.styl");
@Component({
    name: "userpwd",
    template: require("./user.pwd.html"),
    components: {
        ModuleTitle
    },
    computed: {
        ...mapGetters([
            "personInfo"
        ])
    }
})
export class UserPwd extends Vue {
    // init data
    public form = {
        opwd: "",
        npwd: "",
        npwdAgain: ""
    };

    public userMessage: UserMessageType;

    public rules: FormRuleType = {
        opwd: [
            { required: true, message: "原始密码不能为空", trigger: "blur" },
            // { message: "密码不符合要求", validator: FromValidator.pwd, trigger: "blur" }
        ],
        npwd: [
            { required: true, message: "新密码不能为空", trigger: "blur" },
            { message: "密码不符合要求", validator: FromValidator.pwd, trigger: "blur" }
        ],
        npwdAgain: [
            { required: true, message: "确认密码不能为空", trigger: "blur" },
            { message: "与密码不符合", validator: this.npwdAgain, trigger: "blur" }
        ]
    };
    // init computed
    public personInfo: UserCenterType;


    // lifecircle hook 
    created() {
        this.userMessage = this.personInfo.default;
    }

    // init methods
    npwdAgain(rule: FormRuleType, value: string, callback: Function) {
        if (value !== this.form.npwd) {
            callback(new Error("两次输入密码不一致"));
        } else {
            callback();
        }
    }
    submitForm(formName: string) {
        let temp: any = this.$refs[formName];
        temp.validate((valid: boolean) => {
            if (valid) {
                UserServer.changePwd(this.form).then((res: ResType & any) => {
                    switch (res.status) {
                        case "suc":
                            ElementUI.Message.success(res.message);
                            break;
                        default:
                            break;
                    }
                });
            } else {
                ElementUI.Message.info("修改密码错误,表单验证不成功");
                return false;
            }
        });
    }

    resetForm(formName: string) {
        let temp: any = this.$refs[formName];
        temp.resetFields();
    }
}