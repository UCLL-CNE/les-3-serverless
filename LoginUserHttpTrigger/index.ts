import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { unauthenticatedRouteWrapper } from "../helpers/function-wrapper";
import { CustomError } from "../domain/custom-error";
import { UserService } from "../service/user-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await unauthenticatedRouteWrapper(async () => {
        context.log('HTTP trigger function processed a request.');
        if (!req.body || !req.body.email || !req.body.password) {
            throw CustomError.invalid("Please provide an email and password to login.");
        }

        const {
            email, password
        } = req.body;

        const user = await UserService.getInstance().getUser(email);
        await user.validate(password)

        context.res = {
            body: { email },
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context);
};

export default httpTrigger;