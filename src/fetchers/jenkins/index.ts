import { fetchData as fetchLatest, JenkinsLatestBuildData } from './latest';

export type JenkinsData = JenkinsLatestBuildData;

export async function fetchData(): Promise<JenkinsData> {
  const latest = fetchLatest();

  return {
    ...(await latest),
  };
}
