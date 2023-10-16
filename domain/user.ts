import { CustomError } from "./custom-error";
import { compare } from "./hash";

export class User {
  constructor(readonly email: string, readonly passwordHash: string) {
    if (!email || !passwordHash) {
      throw CustomError.invalid("Email or password are invalid.");
    }
  }

  async validate(password: string) {
    if (!password) {
      throw CustomError.unauthenticated("Password is invalid.");
    }

    if (!(await compare(password, this.passwordHash))) {
      throw CustomError.unauthenticated("Password is invalid.");
    }

    return true;
  }

  toSimpleUser() {
    return new SimpleUser(this.email);
  }
}

export class SimpleUser {
  constructor(readonly email: string) { }
}