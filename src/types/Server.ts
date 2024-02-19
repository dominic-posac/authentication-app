import { Application } from 'express';
import http from 'http';
import Controller from './Controller';

export default class Server {
  private app: Application;
  private readonly port: string;

  constructor(app: Application, port: string) {
    this.app = app;
    this.port = port;
  }

  public run(): http.Server {
    return this.app.listen(this.port, () => {
      console.log(`The server is running on port ${this.port}`);
    });
  }

  public loadControllers(controllers: Array<Controller>): void {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.setRoutes());
  });
}
}
