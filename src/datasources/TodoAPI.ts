import { RESTDataSource } from "apollo-datasource-rest";
import axios from "axios";

class TodoAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:5000";
  }
  public async getTasks(userId: string) {
    const url = `${this.baseURL}/list/${userId}`;
    console.log(`@todoAPI: calling ${url}`);

    const resp = await axios.get(url, {
      headers: {
        Accept: "application/json",
      },
    });
    console.log(`TODO API data :: ${JSON.stringify(resp.data)}`);
    return resp.data;
  }
}

export default new TodoAPI();
