# spark-downloads-api

A HTTP API which collects and serves various information about the spark project.

The base URL is https://sparkapi.lucko.me/


## Routes

### GET `/download`

Gets the latest available versions for download.

#### Response (success, `200`, `application/json`)

```json
{
  "bukkit": {
    "fileName": "spark-1.9.15-bukkit.jar",
    "url": "https://ci.lucko.me/job/spark/317/artifact/spark-bukkit/build/libs/spark-1.9.15-bukkit.jar",
    "sha1": "4ed9dec0b61e9aef7979bbc70dd0e1d562fcf6ea"
  },
  "fabric": {
    "fileName": "spark-1.9.15-fabric.jar",
    "url": "https://ci.lucko.me/job/spark/317/artifact/spark-fabric/build/libs/spark-1.9.15-fabric.jar",
    "sha1": "fa7738667d44b235107a084543904c9e40877c7c"
  },
  "forge": {
    "fileName": "spark-1.9.15-forge.jar",
    "url": "https://ci.lucko.me/job/spark/317/artifact/spark-forge/build/libs/spark-1.9.15-forge.jar",
    "sha1": "ed69c08b3a3f3ac93d7b26babba16cf912ac240a"
  }
}
```

___

### GET `/download/:platform`

Downloads the latest available version for the given platform.

#### Response (success, `200`, `application/java-archive`)

> Streams the jar file contents

___

### GET `/download/:platform/sha1`

Gets the hex encoded SHA1 of the latest available version for the given platform.

#### Response (success, `200`, `text/plain`)

```
4ed9dec0b61e9aef7979bbc70dd0e1d562fcf6ea
```

___

### GET `/version`

Gets the current version information.

#### Response (success, `200`, `application/json`)

```json
{
  "name": "1.9.15",
  "timestamp": 1656193829608
}
```
