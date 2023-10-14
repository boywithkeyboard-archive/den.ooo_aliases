import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { readFile, writeFile } from 'node:fs/promises'

async function check() {
  const schema = Type.Record(
    Type.RegExp(/^[a-z0-9-]$/),
    Type.Union([
      Type.String(),
      Type.Object({
        src: Type.String(),
        attachExtension: Type.Optional(
          Type.String()
        )
      })
    ])
  )

  const str = await readFile('./aliases.json', { encoding: 'utf-8' })

  , json = JSON.parse(str)

  , original = JSON.stringify(json, null, 2)

  , sorted = Object.keys(json)
    .sort()
    .reduce((acc, key) => { 
      acc[key] = json[key]
      
      return acc
    }, {})

  if (!Value.Check(schema, sorted))
    throw new Error('bad format')

  if (JSON.stringify(sorted, null, 2) !== original)
    throw new Error('bad order')

  await writeFile('./aliases.json', JSON.stringify(sorted, null, 2))
}

check()
