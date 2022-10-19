"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authDirective = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
function authDirective(directiveName) {
    const typeDirectiveArgumentMaps = {};
    return {
        authDirectiveTransformer: (schema) => (0, utils_1.mapSchema)(schema, {
            [utils_1.MapperKind.TYPE]: (type) => {
                var _a;
                const authDirective = (_a = (0, utils_1.getDirective)(schema, type, directiveName)) === null || _a === void 0 ? void 0 : _a[0];
                if (authDirective) {
                    typeDirectiveArgumentMaps[type.name] = authDirective;
                }
                return undefined;
            },
            [utils_1.MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
                var _a, _b;
                const authDirective = (_b = (_a = (0, utils_1.getDirective)(schema, fieldConfig, directiveName)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : typeDirectiveArgumentMaps[typeName];
                if (authDirective) {
                    const { requires } = authDirective;
                    if (requires) {
                        const { resolve = graphql_1.defaultFieldResolver } = fieldConfig;
                        fieldConfig.resolve = function (source, args, context, info) {
                            const user = context.currentUser || {};
                            if (user.role !== requires) {
                                throw new Error('Unauthenticated Access!');
                            }
                            return resolve(source, args, context, info);
                        };
                        return fieldConfig;
                    }
                }
            },
        }),
    };
}
exports.authDirective = authDirective;
