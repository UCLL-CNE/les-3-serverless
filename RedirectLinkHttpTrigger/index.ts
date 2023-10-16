import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { LinkService } from "../service/link-service";
import { openRouteWrapper } from "../helpers/function-wrapper";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {

        context.log('HTTP trigger function processed a request.');

        const mapping = context.bindingData.mapping;

        const link = await LinkService.getInstance().getLinkByMapping(mapping);

        context.res = {
            status: 301,
            headers: {
                "Location": link
            }
        };
    }, context)
};

export default httpTrigger;