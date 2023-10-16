import { CustomError } from "../domain/custom-error";
import { Link } from "../domain/link";
import { SimpleUser } from "../domain/user";
import { CosmosLinkRepository } from "../repository/cosmos-link-repository";

export class LinkService {

  private static instance: LinkService

  public static getInstance() {
    if (!this.instance) {
      this.instance = new LinkService();
    }
    return this.instance;
  }

  private async getRepo() {
    return CosmosLinkRepository.getInstance();
  }

  async getAllMappings(user: SimpleUser) {
    return (await this.getRepo()).getAllLinkMappings(user.email);
  }

  async getLinkByMapping(mapping: string) {

    if (!mapping || mapping.length === 0) {
      throw CustomError.invalid("Mapping can not be empty.");
    }

    const linkMapping = await (await this.getRepo()).getLinkMapping(mapping)

    if (!linkMapping) {
      throw CustomError.notFound(`Link mapping ${mapping} not found.`);
    }
    return linkMapping.link
  }

  async linkMappingExists(mapping: string) {
    if (!mapping || mapping.length === 0) {
      throw CustomError.invalid("Mapping can not be empty.");
    }

    return (await this.getRepo()).linkMappingExists(mapping);
  }

  async setLink(link: Link) {
    if (!link) {
      throw CustomError.invalid("Link mapping can not be null.");
    }

    if (await this.linkMappingExists(link.mapping)) {
      throw CustomError.conflict("This mapping is already in use.");
    }

    await (await this.getRepo()).createLinkMapping(link);
  }

  async removeLinkByMapping(mapping: string, user: SimpleUser) {
    if (!mapping || mapping.length === 0) {
      throw CustomError.invalid("Mapping can not be empty.");
    }

    const foundLinkMapping = await (await this.getRepo()).getLinkMapping(mapping);

    if (foundLinkMapping.user.email !== user.email) {
      throw CustomError.unauthorized("This mapping belongs to another user.");
    }

    return (await this.getRepo()).removeLinkMapping(mapping);
  }
}