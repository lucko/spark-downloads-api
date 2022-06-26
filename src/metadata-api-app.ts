import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import prom from 'express-prom-bundle';
import morgan from 'morgan';
import { DataManager } from './data-manager';
import { DataRouter } from './routers/data-router';

export class MetadataApiApp {
  express: express.Express;
  dataManager: DataManager;
  dataRouter: DataRouter;

  constructor() {
    this.express = express();
    this.configure();

    this.dataManager = new DataManager();
    this.dataRouter = new DataRouter(this.dataManager);
    this.setupRoutes();
  }

  configure() {
    this.express.use(morgan('dev'));
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cors());
    this.express.disable('x-powered-by');

    if (process.env.METADATA_API_METRICS) {
      this.express.use(
        '/metrics',
        (req: Request, res: Response, next: NextFunction) => {
          if (req.header('X-Forwarded-For')) {
            res.status(401).send('Unauthorized');
          } else {
            next();
          }
        }
      );
      this.express.use(
        prom({
          includePath: true,
          includeUp: false,
        })
      );
    }
  }

  setupRoutes() {
    this.express.use('/health', this.health);
    this.express.use('/', this.dataRouter.express);
  }

  health(req: Request, res: Response) {
    res.status(200).header('Cache-Control', 'no-cache').send({ status: 'ok' });
  }
}
