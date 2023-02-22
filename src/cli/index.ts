import { Command } from 'commander'
import { glob } from 'glob'
import path, { join } from 'path'
import { roadmapJsonToBmpr } from '../utils/roadmap-json-to-bmpr.util'
const program = new Command()

program.name('roadmap-to-json-bmpr').description('Convert bmpr to roadmap json')

program
  .command('2bmpr')
  .description('convert json files to bmpr')
  .argument('<string>', 'path to json files folder')
  .argument('<string>', 'path to bmpr save folder')
  .action((source: string, dest: string) => {
    glob(join(source, '*.json'), (_err, matches) => {
      matches.map((match) => {
        const parsedPath = path.parse(match)
        roadmapJsonToBmpr({
          jsonPath: match,
          bmprPath: join(dest, `${parsedPath.name}.bmpr`),
        })
      })
    })
  })
program
  .command('2json')
  .description('convert bmpr files to json')
  .argument('<string>', 'path to bmpr files folder')
  .argument('<string>', 'path to json save folder')
  .action((source: string, dest: string) => {
    glob(join(source, '*.bmpr'), (_err, matches) => {
      matches.map((match) => {
        const parsedPath = path.parse(match)
        roadmapJsonToBmpr({
          jsonPath: match,
          bmprPath: join(dest, `${parsedPath.name}.json`),
        })
      })
    })
  })

program.parse()
