export function bold(str) {
  return "\x1b[1m" + str + "\x1b[0m";
}

export function standout(str) {
  return "\x1b[3m" + str + "\x1b[0m";
}

export function dim(str) {
  return "\x1b[2m" + str + "\x1b[0m";
}

export function yellow(str) {
  return "\x1b[33m" + str + "\x1b[0m";
}

export function red(str) {
  return "\x1b[31m" + str + "\x1b[0m";
}

export function magenta(str) {
  return "\x1b[35m" + str + "\x1b[0m";
}

export function green(str) {
  return "\x1b[32m" + str + "\x1b[0m";
}