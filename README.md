# A library for converting balsamiq `.bmpr` to roadmap.sh `.json`, and vice versa

usage:

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
