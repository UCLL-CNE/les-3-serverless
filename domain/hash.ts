import { hash as bHash, compare as bCompare}  from "bcryptjs";

const saltRounds = 10;

export const hash = async (value: string) => {
  return bHash(value, saltRounds);
}

export const compare = async (value: string, hash: string) => {
  return bCompare(value, hash);
}