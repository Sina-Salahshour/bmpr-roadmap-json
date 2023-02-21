import { openDb } from "./db.util";
import fs from "fs/promises";
import { IRoadmapJson } from "../models/roadmap-json";
import { randomUUID } from "crypto";
import balsamiqDefaults from "../constants/balsamiq-defaults.constant.json";
import {
  IInfoEntries,
  IParsedInfoArchiveAttributes,
} from "../models/balsamiq-info";
import {
  IParsedThumbnailAttributes,
  IThumbnail,
} from "../models/balsamiq-thumbnail";
import {
  IParsedData,
  IParsedResourceAttributes,
  IResource,
} from "../models/balsamiq-resource";
import { IBranch, IParsedBranchAttributes } from "../models/balsamiq-branch";
import { Database } from "sqlite";
import { Database as DBDriver, Statement } from "sqlite3";

export interface RoadmapJsonToBmprOptions {
  jsonPath: string;
  bmprPath: string;
}

async function clearTables(db: Database<DBDriver, Statement>) {
  await Promise.all([
    db.run(`
  DROP TABLE IF EXISTS 'INFO';
  `),
    db.run(`
  DROP TABLE IF EXISTS 'BRANCHES';
  `),
    db.run(`
  DROP TABLE IF EXISTS 'RESOURCES';
  `),
    db.run(`
  DROP TABLE IF EXISTS 'THUMBNAILS';
  `),
  ]);
}

async function createTables(db: Database<DBDriver, Statement>) {
  await db.run(`
CREATE TABLE IF NOT EXISTS 'INFO' (NAME TEXT PRIMARY KEY, VALUE TEXT);
`);
  await db.run(`
CREATE TABLE IF NOT EXISTS 'BRANCHES' (ID TEXT PRIMARY KEY, ATTRIBUTES TEXT);
`);
  await db.run(`
CREATE TABLE IF NOT EXISTS 'RESOURCES' (ID TEXT, BRANCHID TEXT, ATTRIBUTES TEXT, DATA TEXT, PRIMARY KEY (ID, BRANCHID), FOREIGN KEY (BRANCHID) REFERENCES BRANCHES(ID));
`);
  await db.run(`
CREATE TABLE IF NOT EXISTS 'THUMBNAILS' (ID TEXT PRIMARY KEY, ATTRIBUTES TEXT);
`);
}

async function fillInfoValues(
  db: Database<DBDriver, Statement>,
  jsonFile: IRoadmapJson,
  { creationDate }: { creationDate: number }
) {
  const infoValues = Object.entries({
    ArchiveAttributes: JSON.stringify({
      creationDate,
      name: jsonFile.mockup.attributes.name,
    } satisfies IParsedInfoArchiveAttributes),
    ArchiveFormat: balsamiqDefaults.info.archiveFormat,
    ArchiveRevision: "0",
    ArchiveRevisionUUID: randomUUID(),
    SchemaVersion: balsamiqDefaults.info.schemaVersion,
  } as const satisfies IInfoEntries).map((values) =>
    values.map((value) => `'${value}'`)
  );
  await db.run(`
  INSERT INTO INFO values
  ${infoValues.map((values) => `(${values.join(",")})`)};
  `);
}

async function fillBranchesValues(
  db: Database<DBDriver, Statement>,
  jsonFile: IRoadmapJson,
  { creationDate }: { creationDate: number }
) {
  const branchFields = {
    ATTRIBUTES: JSON.stringify({
      ...balsamiqDefaults.branches,
      creationDate,
    } satisfies IParsedBranchAttributes),
    ID: jsonFile.mockup.branchID,
  } satisfies IBranch;
  await db.run(`
  INSERT INTO BRANCHES values
  ('${branchFields["ID"]}','${branchFields["ATTRIBUTES"]}');
  `);
}

async function fillThumbnailsValues(
  db: Database<DBDriver, Statement>,
  jsonFile: IRoadmapJson,
  { thumbnailId }: { thumbnailId: string }
) {
  const thumbnailFields = {
    ID: thumbnailId,
    ATTRIBUTES: JSON.stringify({
      branchID: jsonFile.mockup.branchID,
      image: balsamiqDefaults.thumbnails.thumbnailImage,
      resourceID: jsonFile.mockup.resourceID,
    } satisfies IParsedThumbnailAttributes),
  } satisfies IThumbnail;
  await db.run(`
  INSERT INTO THUMBNAILS values
  ('${thumbnailFields["ID"]}', '${thumbnailFields["ATTRIBUTES"]}');
  `);
}
async function fillResourcesValues(
  db: Database<DBDriver, Statement>,
  jsonFile: IRoadmapJson,
  { creationDate, thumbnailId }: { creationDate: number; thumbnailId: string }
) {
  const resourceID = jsonFile.mockup.resourceID;
  const branchID = jsonFile.mockup.branchID;
  const attributes = JSON.stringify({
    ...balsamiqDefaults.resources.attributes,
    thumbnailId,
    creationDate,
    name: jsonFile.mockup.attributes.name,
  } satisfies IParsedResourceAttributes);
  const data = JSON.stringify({
    mockup: jsonFile.mockup,
  } satisfies IParsedData);
  await db.run(`
  INSERT INTO RESOURCES values
  ('${resourceID}', '${branchID}', '${attributes}', '${data}')
  `);
}

export async function roadmapJsonToBmpr({
  jsonPath,
  bmprPath,
}: RoadmapJsonToBmprOptions) {
  const creationDate = new Date().getTime();

  const thumbnailId = randomUUID().toUpperCase();
  const db = await openDb(bmprPath);
  const jsonFile = JSON.parse(
    (await fs.readFile(jsonPath, { flag: "r" })).toString()
  ) as IRoadmapJson;

  await clearTables(db);
  await createTables(db);
  await Promise.all([
    fillInfoValues(db, jsonFile, { creationDate }),
    fillBranchesValues(db, jsonFile, { creationDate }),
    fillThumbnailsValues(db, jsonFile, { thumbnailId }),
    fillResourcesValues(db, jsonFile, { creationDate, thumbnailId }),
  ]);
}
