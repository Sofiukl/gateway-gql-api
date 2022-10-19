import { GraphQLSchema } from 'graphql';
import express from 'express';

export interface AuthDirectiveTransformerType {
  authDirectiveTransformer: (schema: GraphQLSchema) => GraphQLSchema;
}

export interface MyTodosServerContext {
  req: express.Request;
}
