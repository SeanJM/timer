export type Omit<A, B> = Pick<A, Exclude<keyof A, B>>;