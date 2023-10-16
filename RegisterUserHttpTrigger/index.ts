import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CustomError } from "../domain/custom-error";
import { UserService } from "../service/user-service";
import { unauthenticatedRouteWrapper } from "../helpers/function-wrapper";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await unauthenticatedRouteWrapper(async () => {
        context.log('HTTP trigger function processed a request.');

        if (!req.body || !req.body.email || !req.body.password) {
            throw CustomError.invalid("Please provide an email and password to register.");
        }

        const {
            email, password
        } = req.body;

        await UserService.getInstance().addUser(email, password);


        context.res = {
            status: 201,
            body: { email },
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context)
};

export default httpTrigger;