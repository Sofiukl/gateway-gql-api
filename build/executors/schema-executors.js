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
exports.fetchUserSchema = exports.userExecutor = void 0;
const graphql_1 = require("graphql");
const graphql_request_1 = require("graphql-request");
const load_1 = require("@graphql-tools/load");
const url_loader_1 = require("@graphql-tools/url-loader");
const url = process.env.MY_TODOS_USER_GQL_SERVICE
    || "https://my-todos-user-gql-api.herokuapp.com/graphql";
// const userServiceAuthorizationId = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvZmlrdWwubWFsbGlja0BlbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2NjYyNDczMjksImV4cCI6MTY2NjI1ODEyOX0.Z2BJr2ZLvRBpU5xHdpOWaHZrENECAcht3PP-sprCx5Q";
const userExecutor = ({ document, variables, context }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`userExecutor: CONTEXT : ${context}`);
    const query = (0, graphql_1.print)(document);
    return yield (0, graphql_request_1.rawRequest)(url, query, variables, {
        Authorization: context === null || context === void 0 ? void 0 : context.req.headers.authorization,
    });
});
exports.userExecutor = userExecutor;
const fetchUserSchema = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Loading schema from ${url}`);
    const userSchema = yield (0, load_1.loadSchema)(url, {
        loaders: [new url_loader_1.UrlLoader()],
        // headers: { // required if schema fetching is protected
        //   Authorization: userServiceAuthorizationId,
        // },
    });
    console.log(`Successfully loaded schema from user service.`);
    return userSchema;
});
exports.fetchUserSchema = fetchUserSchema;
