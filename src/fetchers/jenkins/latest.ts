import axios from 'axios';
import crypto from 'crypto';
import { jenkinsUrl } from './util';

export interface JenkinsLatestBuildData {
  version: VersionInfo;
  latest: Record<string, FileInfo>;
}

export interface VersionInfo {
  name: string;
  timestamp: string;
}

export interface FileInfo {
  fileName: string;
  url: string;
  sha1: string;
}

const url =
  jenkinsUrl +
  'job/spark/lastSuccessfulBuild/api/json?tree=id,timestamp,url,artifacts[fileName,relativePath]';

export async function fetchData(): Promise<JenkinsLatestBuildData> {
  const resp = (await axios.get(url)).data;

  const version = resp.artifacts[0].fileName.split('-')[1];
  const versionTimestamp = resp.timestamp;

  const downloads: Record<string, FileInfo> = {};
  for (const artifact of resp.artifacts) {
    const { relativePath, fileName } = artifact;

    const platform = relativePath.split('/')[0].split('-')[1];

    const url = resp.url + 'artifact/' + relativePath;
    const sha1 = await sha1Hash(url);

    downloads[platform] = {
      fileName,
      url,
      sha1,
    };
  }

  return {
    version: {
      name: version,
      timestamp: versionTimestamp,
    },
    latest: downloads,
  };
}

async function sha1Hash(url: string) {
  const absUrl = url.replace('https://ci.lucko.me/', jenkinsUrl);

  const resp = await axios.get(absUrl, {
    responseType: 'stream',
  });
  const stream = resp.data;

  return await new Promise<string>((resolve, reject) => {
    const hash = crypto.createHash('sha1');
    hash.setEncoding('hex');

    stream.on('end', () => {
      hash.end();
      resolve(hash.read());
    });

    stream.pipe(hash);
  });
}
