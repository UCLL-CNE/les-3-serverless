import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import { LinkService } from "../service/link-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await authenticatedRouteWrapper(async (user) => {
        const links = await LinkService.getInstance().getAllMappings(user);

        context.res = {
            body: links,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context)
    context.log('HTTP trigger function processed a request.');
};

export default httpTrigger;