import { DROPDOWN_LIST } from "./dropdown-list";

export function pushDropdown(name: string, statelessFunction: (props: any) => React.ReactElement<any>) {
  DROPDOWN_LIST[name] = statelessFunction;
}