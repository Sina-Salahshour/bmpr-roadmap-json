"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roadmapJsonToBmpr = void 0;
const db_util_1 = require("./db.util");
const promises_1 = __importDefault(require("fs/promises"));
const crypto_1 = require("crypto");
const balsamiq_defaults_constant_json_1 = __importDefault(require("../constants/balsamiq-defaults.constant.json"));
function clearTables(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([
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
    });
}
function createTables(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.run(`
CREATE TABLE IF NOT EXISTS 'INFO' (NAME TEXT PRIMARY KEY, VALUE TEXT);
`);
        yield db.run(`
CREATE TABLE IF NOT EXISTS 'BRANCHES' (ID TEXT PRIMARY KEY, ATTRIBUTES TEXT);
`);
        yield db.run(`
CREATE TABLE IF NOT EXISTS 'RESOURCES' (ID TEXT, BRANCHID TEXT, ATTRIBUTES TEXT, DATA TEXT, PRIMARY KEY (ID, BRANCHID), FOREIGN KEY (BRANCHID) REFERENCES BRANCHES(ID));
`);
        yield db.run(`
CREATE TABLE IF NOT EXISTS 'THUMBNAILS' (ID TEXT PRIMARY KEY, ATTRIBUTES TEXT);
`);
    });
}
function fillInfoValues(db, jsonFile, { creationDate }) {
    return __awaiter(this, void 0, void 0, function* () {
        const infoValues = Object.entries({
            ArchiveAttributes: JSON.stringify({
                creationDate,
                name: jsonFile.mockup.attributes.name,
            }),
            ArchiveFormat: balsamiq_defaults_constant_json_1.default.info.archiveFormat,
            ArchiveRevision: "0",
            ArchiveRevisionUUID: (0, crypto_1.randomUUID)(),
            SchemaVersion: balsamiq_defaults_constant_json_1.default.info.schemaVersion,
        }).map((values) => values.map((value) => `'${value}'`));
        yield db.run(`
  INSERT INTO INFO values
  ${infoValues.map((values) => `(${values.join(",")})`)};
  `);
    });
}
function fillBranchesValues(db, jsonFile, { creationDate }) {
    return __awaiter(this, void 0, void 0, function* () {
        const branchFields = {
            ATTRIBUTES: JSON.stringify(Object.assign(Object.assign({}, balsamiq_defaults_constant_json_1.default.branches), { creationDate })),
            ID: jsonFile.mockup.branchID,
        };
        yield db.run(`
  INSERT INTO BRANCHES values
  ('${branchFields["ID"]}','${branchFields["ATTRIBUTES"]}');
  `);
    });
}
function fillThumbnailsValues(db, jsonFile, { thumbnailId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const thumbnailFields = {
            ID: thumbnailId,
            ATTRIBUTES: JSON.stringify({
                branchID: jsonFile.mockup.branchID,
                image: balsamiq_defaults_constant_json_1.default.thumbnails.thumbnailImage,
                resourceID: jsonFile.mockup.resourceID,
            }),
        };
        yield db.run(`
  INSERT INTO THUMBNAILS values
  ('${thumbnailFields["ID"]}', '${thumbnailFields["ATTRIBUTES"]}');
  `);
    });
}
function fillResourcesValues(db, jsonFile, { creationDate, thumbnailId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const resourceID = jsonFile.mockup.resourceID;
        const branchID = jsonFile.mockup.branchID;
        const attributes = JSON.stringify(Object.assign(Object.assign({}, balsamiq_defaults_constant_json_1.default.resources.attributes), { thumbnailId,
            creationDate, name: jsonFile.mockup.attributes.name }));
        const data = JSON.stringify({
            mockup: jsonFile.mockup,
        });
        yield db.run(`
  INSERT INTO RESOURCES values
  ('${resourceID}', '${branchID}', '${attributes}', '${data}')
  `);
    });
}
function roadmapJsonToBmpr({ jsonPath, bmprPath, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const creationDate = new Date().getTime();
        const thumbnailId = (0, crypto_1.randomUUID)().toUpperCase();
        const db = yield (0, db_util_1.openDb)(bmprPath);
        const jsonFile = JSON.parse((yield promises_1.default.readFile(jsonPath, { flag: "r" })).toString());
        yield clearTables(db);
        yield createTables(db);
        yield Promise.all([
            fillInfoValues(db, jsonFile, { creationDate }),
            fillBranchesValues(db, jsonFile, { creationDate }),
            fillThumbnailsValues(db, jsonFile, { thumbnailId }),
            fillResourcesValues(db, jsonFile, { creationDate, thumbnailId }),
        ]);
    });
}
exports.roadmapJsonToBmpr = roadmapJsonToBmpr;
//# sourceMappingURL=roadmap-json-to-bmpr.util.js.map