import {GraphQLSchema, print } from "graphql";
import { Executor } from "@graphql-tools/utils";
import { rawRequest } from "graphql-request";
import { loadSchema } from "@graphql-tools/load";
import { UrlLoader } from "@graphql-tools/url-loader";

const url = process.env.MY_TODOS_USER_GQL_SERVICE 
              || "https://my-todos-user-gql-api.herokuapp.com/graphql";

// const userServiceAuthorizationId = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvZmlrdWwubWFsbGlja0BlbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2NjYyNDczMjksImV4cCI6MTY2NjI1ODEyOX0.Z2BJr2ZLvRBpU5xHdpOWaHZrENECAcht3PP-sprCx5Q";

export const userExecutor: Executor = async ({document, variables, context}) => {
    console.log(`userExecutor: CONTEXT : ${context}`);
    const query = print(document);
    return await rawRequest(url, query, variables, {
      Authorization: context?.req.headers.authorization,
    });
};

export const fetchUserSchema = async (): Promise<GraphQLSchema> => {
  console.log(`Loading schema from ${url}`);
  const userSchema = await loadSchema(url, {
    loaders: [new UrlLoader()],
    // headers: { // required if schema fetching is protected
    //   Authorization: userServiceAuthorizationId,
    // },
  });
  console.log(`Successfully loaded schema from user service.`);
  return userSchema;
}