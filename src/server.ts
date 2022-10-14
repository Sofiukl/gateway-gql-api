import { ApolloServer } from "apollo-server";
import fs from "fs";
import { stitchSchemas } from "@graphql-tools/stitch";
import { AsyncExecutor } from "@graphql-tools/utils";
import { introspectSchema, wrapSchema } from "@graphql-tools/wrap";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { delegateToSchema } from "@graphql-tools/delegate";
import { print } from "graphql";
import { rawRequest } from "graphql-request";
import todoAPI from "./datasources/TodoAPI";
import todosResolvers from "./resolvers/todos";
import { getCurrentUser } from "./utils/auth";
import { filterHeaders } from "./utils/common";
import { CustomSQLDataSource } from "./datasources/task";
import * as dotenv from "dotenv";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
dotenv.config();

const normalizePort = (val: string) => {
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

let schema = fs.readFileSync("./src/schema.graphql", "utf8");

const createRemoteSchema = async (url: string) => {
  const executor: AsyncExecutor = async ({ document, variables, context }) => {
    //TODO: context is undefined here and use dynamic auth token as coming in header
    console.log(`CONTEXT : ${context}`);
    const query = print(document);
    return await rawRequest(url, query, variables, {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InUxIiwiZW1haWwiOiJzbWFsbGlja0BlbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2NjQ5NjI5MjIsImV4cCI6MTY2NDk3MzcyMn0.NjLcJr55ahNqxZ21RUnnEXfmjneaAxuGdMNdujLdaKw`,
    });
  };
  const schema = wrapSchema({
    schema: await introspectSchema(executor),
    executor: executor,
  });

  return schema;
};

const createLocalSchema = async (path: string) => {
  let todoSchemaStr = fs.readFileSync(path, "utf8");

  let todoSchema = makeExecutableSchema({
    typeDefs: [todoSchemaStr],
    resolvers: todosResolvers,
  });

  return { schema: todoSchema };
};

const createHandler = async () => {
  try {
    const userSchema = await createRemoteSchema(
      process.env.MY_TODOS_USER_GQL_SERVICE ||
        "https://my-todos-user-gql-api.herokuapp.com/graphql"
    );
    const todoSchema = await createLocalSchema("./src/schema.todo.graphql");
    const gatewaySchema = stitchSchemas({
      subschemas: [userSchema, todoSchema],
      typeDefs: schema,
      resolvers: {
        GetUserResponse: {
          todos: {
            selectionSet: `{ id }`,
            resolve(user, args, context, info) {
              return delegateToSchema({
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
              return delegateToSchema({
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

    const server = new ApolloServer({
      schema: gatewaySchema,
      csrfPrevention: true,
      cache: "bounded",
      context: ({ req }) => {
        const user = getCurrentUser({ req });
        const filteredHeader: any = filterHeaders(req.headers, [
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
          todoAPI: todoAPI,
          // db,
        };
      },
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    const { url } = await server.listen(port);
    console.log(`🚀  Server ready at ${url}`);
  } catch (err) {
    console.log(err);
    return null;
  }
};

createHandler();
