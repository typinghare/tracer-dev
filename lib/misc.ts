export function getParamNameList(func: Function): Array<string> {
  const str = func.toString().trim();
  const match = str.match(/^.*\((.*)\)[^{]*{/);
  if (match == null) return [];
  return match[1].split(',').map(s => s.trim());
}