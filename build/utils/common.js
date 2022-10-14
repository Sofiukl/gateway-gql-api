"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterHeaders = void 0;
function filterHeaders(headers, nameList) {
    const filteredHeader = nameList
        .map((headerName) => headerName.toLowerCase())
        .filter((headerName) => headers[headerName])
        .map((headerName) => {
        return {
            [headerName]: headers[headerName],
        };
    });
    return filteredHeader;
}
exports.filterHeaders = filterHeaders;
