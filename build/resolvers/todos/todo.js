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
exports.todos = void 0;
function todos(_, input, { req, customHeaders, currentUser, dataSources }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`currentUser ::::  ${JSON.stringify(currentUser)}`);
        //console.log(`Req Header ::::  ${JSON.stringify(req.headers.authorization)}`);
        //console.log(`Custom Header ::::  ${JSON.stringify(customHeaders)}`);
        // const task = await dataSources.db.getTask();
        // console.log(`DB Task: ${JSON.stringify(task)}`);
        return yield dataSources.todoAPI.getTasks(input.userId);
    });
}
exports.todos = todos;
