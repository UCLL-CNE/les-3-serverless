import { CustomError } from "./custom-error";
import { SimpleUser } from "./user";

const FORBIDDEN_MAPPINGS = [
  "all",
  "mappings",
  "login",
  "logout",
  "register",
  "user",
  "users",
  "link",
  "links",
  "api",
  "api-docs",
  "swagger",
  "swagger-ui",
];

export class Link {
  constructor(readonly link: string, readonly mapping: string, readonly user: SimpleUser) {
    if (!link || link.length < 3 || link.length > 2048) {
      throw CustomError.invalid("Link is invalid. Must be between 3 and 2048 characters (inclusive).");
    }

    if (!mapping || mapping.length < 3 || mapping.length > 64) {
      throw CustomError.invalid("Mapping is invalid. Must be between 3 and 64 characters (inclusive).");
    }

    for (const forbiddenMapping of FORBIDDEN_MAPPINGS) {
      if (mapping === forbiddenMapping) {
        throw CustomError.invalid(`Mapping is invalid. Cannot be '${forbiddenMapping}'.`);
      }
    }

    const linkWithProtocol = link.startsWith("http://") || link.startsWith("https://") ? link : `https://${link}`;

    try {
      new URL(linkWithProtocol);
    } catch (error) {
      throw CustomError.invalid("Link is invalid. Must be a valid URL.");
    }

    if (!/^[a-zA-Z0-9-]+$/.test(mapping)) {
      throw CustomError.invalid("Mapping is invalid. Must only contain characters, numbers and dashes.");
    }

    if (!user) {
      throw CustomError.invalid("A link must belong to a user.");
    }

    this.link = linkWithProtocol;
  }
}