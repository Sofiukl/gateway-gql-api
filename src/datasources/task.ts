import { SQLDataSource } from "datasource-sql";
import { Todo } from "../generated/schema";

export class CustomSQLDataSource extends SQLDataSource {
  async getTask(): Promise<Todo[]> {
    return (await this.knex
      .select("*")
      .from("task")
      .where({ id: 1 })) as Todo[];
  }
}
