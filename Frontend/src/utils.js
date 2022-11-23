export function getID(s) {
  return atob(s).split(":")[1];
}
