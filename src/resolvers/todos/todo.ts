import { Todo } from "../../generated/schema";

export async function todos(
  _: unknown,
  input: { userId: string },
  { req, customHeaders, currentUser, dataSources }: any
): Promise<Todo[]> {
  console.log(`currentUser ::::  ${JSON.stringify(currentUser)}`);
  console.log(`Req Header ::::  ${JSON.stringify(req.headers.authorization)}`);
  console.log(`Custom Header ::::  ${JSON.stringify(customHeaders)}`);

  // const task = await dataSources.db.getTask();
  // console.log(`DB Task: ${JSON.stringify(task)}`);

  return await dataSources.todoAPI.getTasks(input.userId);
}
