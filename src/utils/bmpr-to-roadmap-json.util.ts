import { writeFile } from 'fs/promises'
import { openDb } from './db.util'
import {
  IParsedResourceAttributes,
  IParsedData,
  IResource,
} from '../models/balsamiq-resource'
import { injectEmptyProperties } from '../utils/inject-empty-propertes.util'

export interface BmprToRoadmapJsonOptions {
  projectId?: string
  bmprPath: string
  jsonPath: string
}

async function parseBmpr({
  projectId = 'roadmap',
  bmprPath,
}: BmprToRoadmapJsonOptions) {
  const db = await openDb(bmprPath)
  const resources = (await db.get('SELECT * FROM RESOURCES')) as IResource
  const { name, order, notes } = JSON.parse(
    resources.ATTRIBUTES
  ) as IParsedResourceAttributes
  const {
    mockup: { measuredH, measuredW, mockupH, mockupW, version, ...mockup },
  } = JSON.parse(resources.DATA) as IParsedData
  await db.close()
  return {
    mockup: {
      ...injectEmptyProperties(mockup),
      attributes: {
        name,
        order,
        parentID: null,
        notes,
      },
      branchID: resources.BRANCHID,
      resourceID: resources.ID,
      measuredH,
      measuredW,
      mockupH,
      mockupW,
      version,
    },
    groupOffset: { x: 0, y: 0 },
    dependencies: [],
    projectID: projectId,
  }
}

export async function bmprToRoadmapJson({
  bmprPath,
  jsonPath,
  projectId,
}: BmprToRoadmapJsonOptions) {
  const jsonFile = JSON.stringify(
    await parseBmpr({ bmprPath, jsonPath, projectId })
  )
  await writeFile(jsonPath, jsonFile)
}
