# A library for converting balsamiq `.bmpr` to roadmap.sh `.json`, and vice versa

Usage:

```ts
import { roadmapJsonToBmpr } from 'roadmap-json-bmpr'

async function main() {
  await roadmapJsonToBmpr({
    jsonPath: 'file.json',
    bmprPath: 'pathToSave.bmpr',
  })
  await bmprToRoadmapJson({
    bmprPath: 'file.bmpr',
    jsonPath: 'pathToSave.json',
  })
}
```

As a cli:

- bmpr to json

```sh
npx roadmap-json-bmpr 2json <input folder> <output folder>
```

- json to bmpr

```sh
npx roadmap-json-bmpr 2bmpr <input folder> <output folder>
```
