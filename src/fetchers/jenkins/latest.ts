import axios from 'axios';
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
  //sha1: string;
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

    let url = resp.url + 'artifact/' + relativePath;

    downloads[platform] = {
      fileName,
      url,
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
