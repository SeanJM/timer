// tslint:disable:no-default-export
type PartialLocation = Partial<{ pathname: string }>;

export default function pathname(any: string | PartialLocation) {
  const pathname = ((any as PartialLocation).pathname || any) as string;
  const str = pathname.split("?")[0].split("#")[0];
  const https = pathname.indexOf("https") === 0;
  const http = pathname.indexOf("http") === 0;

  return https
    ? str.substring(str.indexOf("/", 8))
    : http
      ? str.substring(str.indexOf("/", 7))
      : str;
}