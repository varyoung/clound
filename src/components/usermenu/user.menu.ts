import Component from "vue-class-component";
import Vue from "vue";
import { RouteConfig } from "vue-router";
import { mapGetters } from "vuex";


import { userCenterRouter } from "@router/user.center";
import { GeneralServer } from "@server/general";
import { ResType } from "@server/index";
import { UserCenterType, USER } from "@store/user.center.type";
import { AxiosResponse } from "axios";


require("./user.menu.styl");
@Component({
    name: "usermenu",
    template: require("./user.menu.html"),
    computed: {
    }
})
export class UserMenu extends Vue {
    public Routers: Array<RouteConfig> = userCenterRouter;
    // init computed
    public personInfo: UserCenterType;
    // lifecircle hook
    created() {
        GeneralServer.oneself().then((response: AxiosResponse<ResType>) => {
            let res: ResType = response.data;
            switch (res.status) {
                case "suc":
                    this.$store.dispatch(USER.DEFAULTUSER, { uid: res.data.uid });
                    break;
                default:
                    break;
            }
        });
    }

    logout() {
        GeneralServer.logout().then((response) => {
            let res: ResType = response.data;
            switch (res.status) {
                case "suc":
                    this.$router.push("/login");
                    break;
                default:
                    break;
            }
        });
    }
}