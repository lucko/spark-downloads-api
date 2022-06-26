# spark-downloads-api

A HTTP API which collects and serves various information about the spark project.

The base URL is https://api.spark.lucko.me/


## Routes

### GET `/download`

Gets the latest available versions for download.

#### Response (success, `200`, `application/json`)

```json
{
  "latest": {
    "bukkit": {
      "fileName": "spark-1.9.15-bukkit.jar",
      "url": "https://ci.lucko.me/job/spark/317/artifact/spark-bukkit/build/libs/spark-1.9.15-bukkit.jar"
    },
    "fabric": {
      "fileName": "spark-1.9.15-fabric.jar",
      "url": "https://ci.lucko.me/job/spark/317/artifact/spark-fabric/build/libs/spark-1.9.15-fabric.jar"
    },
    "forge": {
      "fileName": "spark-1.9.15-forge.jar",
      "url": "https://ci.lucko.me/job/spark/317/artifact/spark-forge/build/libs/spark-1.9.15-forge.jar"
    },
    ...
  }
}
```

___

### GET `/download/:platform`

Downloads the latest available version for the given platform.

#### Response (success, `200`, `application/java-archive`)

> Streams the jar file contents

___

### GET `/version`

Gets the current version information.

#### Response (success, `200`, `application/json`)

```json
{
  "version": {
    "name": "1.9.15",
    "timestamp": 1656193829608
  }
}
```

___

### GET `/changelog`

Gets the current changelog.

#### Response (success, `200`, `application/json`)

```json
{
  "changeLog": [
    {
      "version": "1.9.15",
      "timestamp": 1656193748739,
      "title": "Add providers for world (entity/chunk) statistics",
      "commit": "24d94a18a66d68e9a37a3f68d12ddda1c628b704"
    },
    {
      "version": "1.9.14",
      "timestamp": 1655762920971,
      "title": "New paper config location (#217)",
      "commit": "28cf3185c1374c4b5af277ef28482299694209a3"
    },
    {
      "version": "1.9.13",
      "timestamp": 1654977921056,
      "title": "Tidy up placeholder handling",
      "commit": "2bf40231437633793ba475763a44084e9fff0ad3"
    }
  ]
}
```
