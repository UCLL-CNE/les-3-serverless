import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import { LinkService } from "../service/link-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await authenticatedRouteWrapper(async (user) => {
        const mapping = context.bindingData.mapping;
        await LinkService.getInstance().removeLinkByMapping(mapping, user);
        context.res = {
            body: {
                mapping,
                deleted: true
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context);
};

export default httpTrigger;