"use strict";
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
exports.injectEmptyProperties = void 0;
function injectEmptyProperties({ controls, }) {
    return {
        controls: Object.assign(Object.assign({}, controls), { control: controls.control.map((_a) => {
                var { children, properties } = _a, rest = __rest(_a, ["children", "properties"]);
                return (Object.assign({ properties: properties !== null && properties !== void 0 ? properties : {}, children: children ? injectEmptyProperties(children) : undefined }, rest));
            }) }),
    };
}
exports.injectEmptyProperties = injectEmptyProperties;
//# sourceMappingURL=inject-empty-propertes.util.js.map