import { RESTDataSource } from "apollo-datasource-rest";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
class TodoAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL =
      process.env.MY_TODOS_REST_SERVICE ||
      "https://sm-my-todos-api.herokuapp.com";
  }
  public async getTasks(userId: string) {
    const url = `${this.baseURL}/list/${userId}`;
    //console.log(`@todoAPI: calling ${url}`);

    const resp = await axios.get(url, {
      headers: {
        Accept: "application/json",
      },
    });
    //console.log(`TODO API data :: ${JSON.stringify(resp.data)}`);
    return resp.data;
  }
}

export default new TodoAPI();
