import Component from "vue-class-component";
import { ResType } from "server";
import { DiplomaBaseClass } from "@views/base/base.class";

@Component({
    name: "updatediploma",
    template: require("./update.diploma.html"),
    props: {
        dialogVisible: Boolean,
        uid: {
            type: String
        }
    },
})
export class UpdateDiploma extends DiplomaBaseClass {
    // init computed
    public dialogVisible: boolean;
    // init data
    public loading: boolean = false;
    public upLoadData: any = {
        cid: ""
    };
    public Keytemp: any = "";
    public Crttemp: any = "";

    // lifecycle hook

    // init method
    importDiploma() {
        this.Keytemp = this.$refs.Keyupload;
        this.Crttemp = this.$refs.Crtupload;
        this.Crttemp.submit();
    }
    // 证书验证
    Crtuploader(file: any) {
        const extension = file.name.split(".")[1] === "pem";
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!extension) {
            this.$notify({ 
                title: "提示",
                message: "上传文件格式只能支持pem格式", 
                type: "info" });
        }
        if (!isLt1M) {
            this.$notify({ 
                title: "提示",
                message: "请导入1M以内的文件", 
                type: "info" 
            });
        }

        return isLt1M && extension;
    }
    // 密匙验证
    Keyuploader(file: any) {
        const extension = file.name.split(".")[1] === "pem";
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!extension) {
            this.$notify({ 
                title: "提示",
                message: "上传文件格式只能支持pem格式", 
                type: "info" 
            });
        }
        if (!isLt1M) {
            this.$notify({ 
                title: "提示",
                message: "请导入1M以内的文件", 
                type: "info" 
            });
        }
        return isLt1M && extension;
    }

    uploaderCertDone(response: ResType, file: any, fileList: any) {
        let res: ResType = response;

        switch (res.status) {
            case "suc":
                this.$notify({
                    title: "提示",
                    message: "导入证书成功",
                    type: "success"
                });
                this.upLoadData.cid = response.data.cid;
                this.$emit("diplomaCid", this.upLoadData.cid);
                this.Keytemp.submit();
                break;
            case "error":

                this.Crttemp.clearFiles();
                break;
            default:
                break;
        }
    }

    uploaderKeyDone(response: ResType, file: any, fileList: any) {
        let res: ResType = response;
        switch (res.status) {
            case "suc":
                this.$notify({
                    title: "提示",
                    message: "导入密匙成功",
                    type: "success"
                });
                this.upLoadData.cid = response.data.cid;
                this.$emit("diplomaCid", this.upLoadData.cid);
                this.$emit("close", false);
                break;
            case "error":
                let temp: any = this.$refs.Crtupload;
                temp.clearFiles();
                break;
            default:
                break;
        }

    }

    cancel(done: Function) {
        this.close();
    }
}

export interface ResetType {
    pwd: string;
    pwd1: string;
}