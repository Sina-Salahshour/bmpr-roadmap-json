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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bmprToRoadmapJson = void 0;
const promises_1 = require("fs/promises");
const db_util_1 = require("./db.util");
const inject_empty_propertes_util_1 = require("../utils/inject-empty-propertes.util");
function parseBmpr({ projectId = "roadmap", bmprPath, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_util_1.openDb)(bmprPath);
        const resources = (yield db.get("SELECT * FROM resources"));
        const { name, order, notes } = JSON.parse(resources.ATTRIBUTES);
        const _a = JSON.parse(resources.DATA).mockup, { measuredH, measuredW, mockupH, mockupW, version } = _a, mockup = __rest(_a, ["measuredH", "measuredW", "mockupH", "mockupW", "version"]);
        yield db.close();
        return {
            mockup: Object.assign(Object.assign({}, (0, inject_empty_propertes_util_1.injectEmptyProperties)(mockup)), { attributes: {
                    name,
                    order,
                    parentID: null,
                    notes,
                }, branchID: resources.BRANCHID, resourceID: resources.ID, measuredH,
                measuredW,
                mockupH,
                mockupW,
                version }),
            groupOffset: { x: 0, y: 0 },
            dependencies: [],
            projectID: projectId,
        };
    });
}
function bmprToRoadmapJson({ bmprPath, jsonPath, projectId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonFile = JSON.stringify(yield parseBmpr({ bmprPath, jsonPath, projectId }));
        yield (0, promises_1.writeFile)(jsonPath, jsonFile);
    });
}
exports.bmprToRoadmapJson = bmprToRoadmapJson;
//# sourceMappingURL=bmpr-to-roadmap-json.util.js.map