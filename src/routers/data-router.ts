import axios from 'axios';
import express, { Request, Response } from 'express';
import { DataManager } from '../data-manager';

export class DataRouter {
  dataManager: DataManager;
  express = express.Router();

  constructor(dataManager: DataManager) {
    this.dataManager = dataManager;
    this.express.get('/version', this.version.bind(this));
    this.express.get('/download', this.latest.bind(this));
    this.express.get('/download/:platform', this.latestPlatform.bind(this));
    this.express.get('/download/:platform/sha1', this.latestPlatformSha1.bind(this));
  }

  version(_: Request, res: Response) {
    const data = {
      ...this.dataManager.jenkins?.version,
    };
    res.send(data);
  }

  latest(_: Request, res: Response) {
    const data = {
      ...this.dataManager.jenkins?.latest,
    };
    res.send(data);
  }

  async latestPlatform(req: Request, res: Response) {
    const platform = req.params.platform;
    const files = this.dataManager.jenkins?.latest;
    if (!files || !platform) {
      res.status(400).send({ error: 'Try again later' });
      return;
    }

    const file = files[platform];
    if (file == undefined) {
      res.status(404).send({ error: 'Not a platform: ' + platform });
      return;
    }

    const proxyResponse = await axios.get(file.url, {
      responseType: 'stream',
    });

    res.setHeader('Content-Type', proxyResponse.headers['content-type']);
    res.setHeader('Content-Length', proxyResponse.headers['content-length']);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.fileName}"`
    );

    proxyResponse.data.pipe(res);
  }

  async latestPlatformSha1(req: Request, res: Response) {
    const platform = req.params.platform;
    const files = this.dataManager.jenkins?.latest;
    if (!files || !platform) {
      res.status(400).send({ error: 'Try again later' });
      return;
    }

    const file = files[platform];
    if (file == undefined) {
      res.status(404).send({ error: 'Not a platform: ' + platform });
      return;
    }

    res.setHeader('Content-Type', 'text/plain').send(file.sha1);
  }
}
