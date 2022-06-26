import axios from 'axios';
import express, { Request, Response } from 'express';
import { DataManager } from '../data-manager';
import { CombinedData } from '../fetchers';
import { JenkinsData } from '../fetchers/jenkins';

export class DataRouter {
  dataManager: DataManager;
  express = express.Router();

  constructor(dataManager: DataManager) {
    this.dataManager = dataManager;
    this.express.get('/version', this.version.bind(this));
    this.express.get('/changelog', this.changelog.bind(this));
    this.express.get('/download', this.latest.bind(this));
    this.express.get('/download/:platform', this.latestPlatform.bind(this));
  }

  all(_: Request, res: Response) {
    const data: Partial<CombinedData> = {
      ...this.dataManager.jenkins,
    };
    res.send(data);
  }

  version(_: Request, res: Response) {
    const data: Partial<JenkinsData> = {
      version: this.dataManager.jenkins?.version,
    };
    res.send(data);
  }

  changelog(_: Request, res: Response) {
    const data: Partial<JenkinsData> = {
      changeLog: this.dataManager.jenkins?.changeLog,
    };
    res.send(data);
  }

  latest(_: Request, res: Response) {
    const data: Partial<JenkinsData> = {
      latest: this.dataManager.jenkins?.latest,
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
}
