import { toPosixPath } from "./file-utils";

export function isMatchingRegex(regex, path) {
  const posixPath = toPosixPath(path);
  return regex.test(posixPath);
}