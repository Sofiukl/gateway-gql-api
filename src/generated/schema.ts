export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type GetUserResponse = {
  __typename?: 'GetUserResponse';
  todos: Array<Maybe<Todo>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  saveTodo: TaskCreateResponse;
};


export type MutationSaveTodoArgs = {
  assignee?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  priority?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  userId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  todos: Array<Maybe<Todo>>;
};


export type QueryTodosArgs = {
  userId: Scalars['ID'];
};

export enum Role {
  Admin = 'ADMIN',
  Reviewer = 'REVIEWER',
  Unknown = 'UNKNOWN',
  User = 'USER'
}

export type TaskCreateResponse = {
  __typename?: 'TaskCreateResponse';
  id: Scalars['ID'];
};

export type Todo = {
  __typename?: 'Todo';
  assignee?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  priority?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  user: GetUserResponse;
  userId: Scalars['String'];
};
