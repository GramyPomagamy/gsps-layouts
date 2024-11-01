export interface Host {
  name: string;
  pronouns:
    | 'she/her'
    | 'he/him'
    | 'they/she'
    | 'they/them'
    | '';
  [k: string]: unknown;
}
