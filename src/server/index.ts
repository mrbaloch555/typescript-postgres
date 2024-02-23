import express from "express";
import http from "http";
import app from "./app";
import { testDbConnection } from "../db/test-db-connection";
import config from "../config/config";

class Server {
  private app: express.Application;
  private server: http.Server;
  constructor(app: express.Application) {
    this.app = app;
    this.server = this.createServer();
  }

  public createServer(): http.Server {
    return http.createServer(this.app);
  }

  public async serve(port: number) {
    testDbConnection()
      .then(() => {
        this.server.listen(port, () => {
          console.log("Shit is ready to listen on port ", port);
        });
      })
      .catch((err) => {
        console.log(err);
        process.exit(1);
      });
  }
}

new Server(app).serve(config.port);
