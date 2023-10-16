import { CustomError } from "../domain/custom-error";
import { Link } from "../domain/link";
import { CosmosClient, Container } from "@azure/cosmos";
import { CosmosUserRepository } from "./cosmos-user-repository";

interface CosmosDocument {
  id: string,
  email: string,
  link: string
};

export class CosmosLinkRepository {
  private static instance: CosmosLinkRepository;

  private async toLinkMapping(document: CosmosDocument) {
    if (!document.id || !document.link || !document.email) {
      throw CustomError.internal("Invalid user document.");
    }
    const user = await (await CosmosUserRepository.getInstance()).getUser(document.email);
    return new Link(document.link, document.id, user.toSimpleUser());
  }

  constructor(private readonly container: Container) {
    if (!container) {
      throw new Error("Link Cosmos DB container is required.");
    }
  }

  static async getInstance() {
    if (!this.instance) {

      const key = process.env.COSMOS_KEY;
      const endpoint = process.env.COSMOS_ENDPOINT;
      const databaseName = process.env.COSMOS_DATABASE_NAME;
      const containerName = "links";
      const partitionKeyPath = ["/partition"];

      if (!key || !endpoint) {
        throw new Error("Azure Cosmos DB Key, Endpoint or Database Name not provided. Exiting...");
      }

      const cosmosClient = new CosmosClient({ endpoint, key });

      const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
      const { container } = await database.containers.createIfNotExists({
        id: containerName,
        partitionKey: {
          paths: partitionKeyPath
        }
      });

      this.instance = new CosmosLinkRepository(container);
    }
    return this.instance;
  };

  async createLinkMapping(link: Link): Promise<Link> {
    const result = await this.container.items.create({
      link: link.link,
      id: link.mapping,
      email: link.user.email,
      partition: link.mapping.substring(0, 3)
    });
    if (result && result.statusCode >= 200 && result.statusCode < 400) {
      return this.getLinkMapping(link.mapping);
    } else {
      throw CustomError.internal("Could not create user.");
    }
  }

  async linkMappingExists(mapping: string): Promise<boolean> {
    const { resource } = await this.container.item(mapping, mapping.substring(0, 3)).read();
    return !!resource;
  }

  async getLinkMapping(mapping: string): Promise<Link> {
    const { resource } = await this.container.item(mapping, mapping.substring(0, 3)).read();
    if (resource) {
      return this.toLinkMapping(resource)
    } else {
      throw CustomError.notFound(`Link mapping ${mapping} not found.`);
    }
  }

  async getAllLinkMappings(userEmail: string): Promise<Array<Link>> {
    const querySpec = {
      query: "select * from links l where l.email=@email",
      parameters: [
        {
          name: "@email",
          value: userEmail
        }
      ]
    }
    const { resources } = await this.container.items.query(querySpec).fetchAll()
    if (resources) {
      return Promise.all(resources.map(this.toLinkMapping));
    } else {
      throw CustomError.notFound("Link mappings for this account not found.");
    }
  }

  async removeLinkMapping(mapping: string): Promise<boolean> {
    const { statusCode } = await this.container.item(mapping, mapping.substring(0, 3)).delete();
    return statusCode === 204;
  }
}