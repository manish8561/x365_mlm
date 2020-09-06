import * as db from "../helpers/common/db.helper";
class BaseModel {
  constructor() {
  }

  public async callQuery(query: string, connType: string = "normal") {
    const result = await db.default.pdo(query, connType);
    return result;
  }

  public async callQuerys(query: string, connType: string = "normal") {
    const result = await db.default.pdos(query, connType);
    return result;
  }
}
export default BaseModel;
