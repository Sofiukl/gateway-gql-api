export function filterHeaders(headers: any, nameList: String[]) {
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
