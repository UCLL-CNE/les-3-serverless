import { Context } from "@azure/functions";
import { CustomError } from "../domain/custom-error";
import { SimpleUser } from "../domain/user";
import { UserService } from "../service/user-service";

export enum AuthenticationType {
  Authenticated,
  Unauthenticated,
  Either
}

export const authenticatedRouteWrapper = async (handler: (user: SimpleUser) => Promise<void>, context: Context) => {
  try {
    const b64auth = (context.req.headers.authorization || '').split(' ')[1] || ''
    const [email, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    if (email && password) {
      const user = await UserService.getInstance().getUser(email);
      await user.validate(password);
      const simpleUser = user.toSimpleUser();
      await handler(simpleUser);
    } else {
      throw CustomError.unauthenticated("Not authenticated.");
    }
  } catch (error) {
    errorHandler(error, context);
  }
}

export const unauthenticatedRouteWrapper = async (handler: () => Promise<void>, context: Context) => {
  try {
    if (context.req.headers.authorization) {
      throw CustomError.authenticated("Must be unauthenticated to perform this action.");
    }
    await handler();
  } catch (error) {
    errorHandler(error, context);
  }
}

export const openRouteWrapper = async (handler: () => Promise<void>, context: Context) => {
  try {
    await handler();
  } catch (error) {
    errorHandler(error, context);
  }
}

const errorHandler = (error: Error | CustomError, context: Context) => {
  if ((error as any).code) {
    const cError = error as CustomError;
    context.res = {
      body: { message: cError.message },
      status: cError.code,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  } else {
    context.res = {
      body: { message: (error as Error).message },
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
}