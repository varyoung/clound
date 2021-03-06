import Component from "vue-class-component";
import Vue from "vue";
import { mapGetters } from "vuex";


import { ColumnType, TableConfigType, TABLECONFIG } from "@store/table.type";
import { TableServer } from "@server/table";
import { Store } from "@store/store";
import { vm, EventBus, CONSTANT } from "@utils/event";
import { Auxiliary } from "@utils/auxiliary";



const Aux = new Auxiliary<string>();
require("./setcol.styl");
@Component({
    name: "setcol",
    template: require("./setcol.html"),
    props: {
        keyName: {
            type: String,
            default: "label"
        },
        moduleName: {
            type: String
        }
    },
    computed: {
        ...mapGetters([
            "tableConfig"
        ])
    },
})
export class SetCol extends Vue {
    // init computed
    public tableConfig: TableConfigType;
    // init props
    public moduleName: string;
    public keyName: Array<any>;
    // init data
    public columns: Array<ColumnType> = new Array<ColumnType>();
    public unwatch: Function;
    // initial data
    // lifecircle hook
    created() {
        let that = this;
        let id = EventBus.register(CONSTANT.TABLEALL, (event: string, info: any) => {
            that.columns = (<any>Object).assign({}, that.tableConfig[that.moduleName].columns);
        });
        Aux.insertId(id);
        this.unwatch = vm.$watch(() => {
            return this.columns;
        }, (val, oldval) => {
            Store.dispatch(TABLECONFIG.CHANGECOLUMNS, { moduleName: this.moduleName, columns: val });
        }, {
                deep: true
            });
    }
    beforeDestroy() {
        Aux.getIds().map((id, $index) => {
            EventBus.unRegister(id);
        });
        TableServer.setConfig({ code: this.moduleName, value: this.tableConfig[this.moduleName] });
        this.unwatch();
    }
    // method

}