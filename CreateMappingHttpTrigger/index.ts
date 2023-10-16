import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import { Link } from "../domain/link";
import { LinkService } from "../service/link-service";
import { CustomError } from "../domain/custom-error";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await authenticatedRouteWrapper(async (user) => {

        if (!req.body || !req.body.link ||!context.bindingData.mapping) {
            throw CustomError.invalid("A valid link and mapping are required.");
        }

        const newLink = new Link(req.body.link, context.bindingData.mapping.toLowerCase(), user);
        await LinkService.getInstance().setLink(newLink);

        context.res = {
            status: 201,
            body: newLink,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context);
};

export default httpTrigger;