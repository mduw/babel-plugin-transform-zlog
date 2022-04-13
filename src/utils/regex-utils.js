import { toPosixPath } from "./file-utils";

export function isMatchingRegex(regex, path) {
  const posixPath = toPosixPath(path);
  // console.log('posix path', regex, posixPath)
  return regex.test(posixPath);
}