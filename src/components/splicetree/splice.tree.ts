import Component from "vue-class-component";
import { OrganizationServer } from "@server/organization";
import { ResType } from "server";
import { AxiosResponse } from "axios";
import { UserServer } from "@server/user";
import { BaseLibrary } from "@views/base/base.class";


@Component({
    name: "splicetree",
    template: require("./splice.tree.html"),
    props: {
        kind: {
            type: String,
            default: "user"
        },
        arr: {
            type: Array,
            default: []
        }
    }
})
export class SpliceTree extends BaseLibrary {
    // public props
    public kind: "user" | "website";
    public arr: string[];
    // init data
    public checkoutData: any = {};
    // lifecirclehook
    created() {
        window.setTimeout(() => {
            let tempTree: any = this.$refs.treeName;
            tempTree.setCheckedKeys(this.arr);
        }, 3000);
    }
    // init methods
    handleCheckChange(data: any, checked: any, indeterminate: any) {
        console.log(data, checked, indeterminate);       
        if (checked && data.is_leaf) {
            this.checkoutData[data.id] = data;
        } else if (!checked && data.is_leaf) {
            delete this.checkoutData[data.id];
        }
        this.$emit("getData", this.checkoutData);
    }


    loadNode(node: any, resolve: any) {
        if (node.level === 0) {
            let state: {
                id: string;
                tree_label: string;
                nodes: any[]
            }[] = [{
                id: "",
                tree_label: "全部组织机构",
                nodes: []
            }];

            OrganizationServer.getTree().then((response: AxiosResponse<ResType>) => {
                let res: ResType = response.data;
                switch (res.status) {
                    case "suc":
                        if (process.env.PLATFORM === "portal") {
                            state = res.data;
                        } else {
                            state[0].nodes = res.data;
                        }
                        resolve(state);
                        break;
                    default:
                        break;
                }
            });
        }

        if (node.level > 0) {
            if (node.data.id === "") {
                return resolve(node.data.nodes);
            }
            else if (!node.data.is_leaf) {
                if (this.kind === "user") {
                    UserServer.getTreeUserlist({
                        ori_id: node.data.id
                    }).then((response: AxiosResponse<ResType>) => {
                        let res: ResType = response.data;
                        switch (res.status) {
                            case "suc":
                                for (let item of res.data) {
                                    item.is_leaf = true;
                                }
                                resolve(node.data.nodes.concat(res.data));
                                break;
                            default:
                                break;
                        }
                    });
                } else if (this.kind === "website") {
                    UserServer.getTreeWebsitelist({
                        ori_id: node.data.id
                    }).then((response: AxiosResponse<ResType>) => {
                        let res: ResType = response.data;
                        switch (res.status) {
                            case "suc":
                                for (let item of res.data) {
                                    item.is_leaf = true;
                                }
                                resolve(node.data.nodes.concat(res.data));
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
            else {
                return resolve([]);
            }
        }
    }
}