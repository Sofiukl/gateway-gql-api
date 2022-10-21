import { ApolloServer } from "apollo-server";
import fs from "fs";
import { stitchSchemas } from "@graphql-tools/stitch";
import { wrapSchema } from "@graphql-tools/wrap";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { delegateToSchema } from "@graphql-tools/delegate";
import todoAPI from "./datasources/TodoAPI";
import todosResolvers from "./resolvers/todos";
import { filterHeaders } from "./utils/common";
import { CustomSQLDataSource } from "./datasources/task";
import * as dotenv from "dotenv";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { getFirebaseUser } from "./auth/firebase";
import { authDirective } from "./directives/auth.directive";
import { fetchUserSchema, userExecutor } from "./executors/schema-executors";
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

const createLocalSchema = async (path: string) => {
  let todoSchemaStr = fs.readFileSync(path, "utf8");
  // let todoSchema = makeExecutableSchema({
  //   typeDefs: [todoSchemaStr],
  //   resolvers: todosResolvers,
  // });
  const { authDirectiveTransformer } = authDirective('auth');
  const todoSchema = authDirectiveTransformer(
    makeExecutableSchema({
      typeDefs: [todoSchemaStr],
      resolvers: todosResolvers,
    }),
  );
    
  return { schema: todoSchema };
};

const createHandler = async () => {
  try {
    const userSchema = await fetchUserSchema();
    const todoSchema = await createLocalSchema("./src/schema.todo.graphql");
    const gatewaySchema = stitchSchemas({
      subschemas: [
        wrapSchema({schema: userSchema, executor: userExecutor}), 
        todoSchema],
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
      introspection: true,
      context: async ({ req }) => {
        //const user = getCurrentUser({ req });
        const user = await getFirebaseUser({req});
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
