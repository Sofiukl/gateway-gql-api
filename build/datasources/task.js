"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSQLDataSource = void 0;
const datasource_sql_1 = require("datasource-sql");
class CustomSQLDataSource extends datasource_sql_1.SQLDataSource {
    getTask() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.knex
                .select("*")
                .from("task")
                .where({ id: 1 }));
        });
    }
}
exports.CustomSQLDataSource = CustomSQLDataSource;
