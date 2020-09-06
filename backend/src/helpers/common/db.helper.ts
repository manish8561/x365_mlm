import * as mysql from "mysql";
import * as config from "../../config";


class DbHelper {
  private normalPool: any;
  private writePool: any;
  private readPool: any;
  constructor() {
    this.normalPool = this.initializePool("normal");
  }
  public initializePool(connectionType: string) {
    //initializing config variables first
    config.initiate();
    const port: number = parseInt(process.env.MYSQL_PORT!);
    if (connectionType === "normal") {
      return mysql.createPool({
        connectionLimit: 1,
        host: process.env.HOST_NAME,
        database: process.env.DBNAME,
        user: process.env.USER_NAME,
        password: process.env.PASSWORD,
        port
      });
    }
    if (connectionType === "write") {
      return mysql.createPool({
        connectionLimit: 1,
        host: process.env.WRITE_NAME,
        database: process.env.WRITE_DBNAME,
        user: process.env.WRITE_USER_NAME,
        password: process.env.WRITE_PASSWORD,
        port
      });
    }
    if (connectionType === "read") {
      return mysql.createPool({
        connectionLimit: 1,
        host: process.env.READ_HOST_NAME,
        database: process.env.READ_DBNAME,
        user: process.env.READ_USER_NAME,
        password: process.env.READ_PASSWORD,
        port
      });
    }
  }
  public pdo(query: any, conType: string = "normal") {
    let pdoConnect: any;
    if (conType === "read") {
      this.readOpreation();
      pdoConnect = this.readPool;
    } else if (conType === "write") {
      this.writeOpreation();
      pdoConnect = this.writePool;
    } else {
      pdoConnect = this.normalPool;
    }
    return new Promise((resolve, reject) => {
      pdoConnect.getConnection((err: any, connection: any) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        connection.query(query, (error: any, results: any, fields: any) => {
          connection.release();
          if (error) return reject(error);
          if (results.insertId) {
            resolve({ insertId: results.insertId });
          } else {
            const result =
              results.length > 0 ? JSON.parse(JSON.stringify(results[0])) : [];
            resolve(result);
          }
        });
      });
    });
  }

  public pdos(query: any, conType: string = "normal") {
    let pdoConnect: any;
    if (conType === "read") {
      this.readOpreation();
      pdoConnect = this.readPool;
    } else if (conType === "write") {
      this.writeOpreation();
      pdoConnect = this.writePool;
    } else {
      pdoConnect = this.normalPool;
    }
    return new Promise((resolve, reject) => {
      pdoConnect.getConnection((err: any, connection: any) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        connection.query(query, (error: any, results: any, fields: any) => {
          connection.release();
          if (error) return reject(error);
          if (results.insertId) {
            resolve({ insertId: results.insertId });
          } else {
            const result =
              results.length > 0 ? JSON.parse(JSON.stringify(results)) : [];
            resolve(result);
          }
        });
      });
    });
  }
  public readOpreation() {
    this.readPool = this.initializePool("read");
  }
  public writeOpreation() {
    this.writePool = this.initializePool("read");
  }
}
export default new DbHelper();
