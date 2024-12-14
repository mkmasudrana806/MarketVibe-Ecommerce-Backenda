"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * -------------------- makeAllowedFieldData ---------------------
 * @param allowedFields array of allowed fields like (typeof TUser)[] = ['email', 'name',..and so on]
 * @param payload payload data to update
 */
const makeAllowedFieldData = (allowedFields, payload) => {
    const updatedData = {};
    allowedFields.forEach((field) => {
        if (payload[field]) {
            updatedData[field] = payload[field];
        }
    });
    return updatedData;
};
exports.default = makeAllowedFieldData;
