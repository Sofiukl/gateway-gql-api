"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const fs_1 = __importDefault(require("fs"));
const stitch_1 = require("@graphql-tools/stitch");
const wrap_1 = require("@graphql-tools/wrap");
const schema_1 = require("@graphql-tools/schema");
const delegate_1 = require("@graphql-tools/delegate");
const graphql_1 = require("graphql");
const graphql_request_1 = require("graphql-request");
const TodoAPI_1 = __importDefault(require("./datasources/TodoAPI"));
const todos_1 = __importDefault(require("./resolvers/todos"));
const auth_1 = require("./utils/auth");
const common_1 = require("./utils/common");
const dotenv = __importStar(require("dotenv"));
const apollo_server_core_1 = require("apollo-server-core");
dotenv.config();
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || "3000");
let schema = fs_1.default.readFileSync("./src/schema.graphql", "utf8");
const createRemoteSchema = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const executor = ({ document, variables, context }) => __awaiter(void 0, void 0, void 0, function* () {
        //TODO: context is undefined here and use dynamic auth token as coming in header
        console.log(`CONTEXT : ${context}`);
        const query = (0, graphql_1.print)(document);
        return yield (0, graphql_request_1.rawRequest)(url, query, variables, {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InUxIiwiZW1haWwiOiJzbWFsbGlja0BlbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2NjQ5NjI5MjIsImV4cCI6MTY2NDk3MzcyMn0.NjLcJr55ahNqxZ21RUnnEXfmjneaAxuGdMNdujLdaKw`,
        });
    });
    const schema = (0, wrap_1.wrapSchema)({
        schema: yield (0, wrap_1.introspectSchema)(executor),
        executor: executor,
    });
    return schema;
});
const createLocalSchema = (path) => __awaiter(void 0, void 0, void 0, function* () {
    let todoSchemaStr = fs_1.default.readFileSync(path, "utf8");
    let todoSchema = (0, schema_1.makeExecutableSchema)({
        typeDefs: [todoSchemaStr],
        resolvers: todos_1.default,
    });
    return { schema: todoSchema };
});
const createHandler = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSchema = yield createRemoteSchema(process.env.MY_TODOS_USER_GQL_SERVICE ||
            "https://my-todos-user-gql-api.herokuapp.com/graphql");
        const todoSchema = yield createLocalSchema("./src/schema.todo.graphql");
        const gatewaySchema = (0, stitch_1.stitchSchemas)({
            subschemas: [userSchema, todoSchema],
            typeDefs: schema,
            resolvers: {
                GetUserResponse: {
                    todos: {
                        selectionSet: `{ id }`,
                        resolve(user, args, context, info) {
                            return (0, delegate_1.delegateToSchema)({
                                schema: todoSchema,
                                operation: "query",
                                fieldName: "todos",
                                args: { userId: user.id },
                                context,
                                info,
                            });
                        },
                    },
                },
                Todo: {
                    user: {
                        selectionSet: `{ id }`,
                        resolve(todo, args, context, info) {
                            console.log(`todo.userId : ${JSON.stringify(todo)}`);
                            return (0, delegate_1.delegateToSchema)({
                                schema: userSchema,
                                operation: "query",
                                fieldName: "user",
                                args: { userId: todo.userId },
                                context,
                                info,
                            });
                        },
                    },
                },
            },
        });
        // DB Config
        // const knexConfig = {
        //   client: "pg",
        //   connection: {
        //     database: "sofikul.mallick",
        //     user: "sofikul.mallick",
        //     password: "sofikul.mallick",
        //     port: 5433,
        //   },
        // };
        // const db = new CustomSQLDataSource(knexConfig);
        const server = new apollo_server_1.ApolloServer({
            schema: gatewaySchema,
            csrfPrevention: true,
            cache: "bounded",
            context: ({ req }) => {
                const user = (0, auth_1.getCurrentUser)({ req });
                const filteredHeader = (0, common_1.filterHeaders)(req.headers, [
                    "x-headers",
                    "x-level",
                    "authorization",
                ]);
                return {
                    customHeaders: {
                        headers: filteredHeader,
                    },
                    authorization: filteredHeader["authorization"],
                    req,
                    currentUser: user,
                };
            },
            dataSources: () => {
                return {
                    todoAPI: TodoAPI_1.default,
                    // db,
                };
            },
            plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
        });
        const { url } = yield server.listen(port);
        console.log(`🚀  Server ready at ${url}`);
    }
    catch (err) {
        console.log(err);
        return null;
    }
});
createHandler();
