import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/services/auth.service';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateRepository } from '../repositories/template.repository';
import { NFT } from '@arkane-network/arkane-connect/dist/src/models/wallet/NFT';
import axios from 'axios';
import { config } from 'dotenv';

config();

@Injectable()
export class TemplateService {
  private readonly ADMIN_ID = 'd5c001b1-eead-475e-baac-43219c14156e';
  private readonly ADMIN_ADDRESS = '0xaC17244Cd4F718A7a9a2c4dfF2f9C7775934824D';
  private readonly CONTRACT_TRANSACTION_HASH =
    '0xa853fcedd409ce5584ae153bafce88223f1afe650a77b1a3e5b75814d2171b87';
  private readonly CONTRACT_ADDRESS =
    '0xbeB2d63b25002b8959945B0a01aF0D64bf1ddED1';
  private readonly CONTRACT_ID = 1114;
  private readonly APPLICATION_ID = process.env.APPLICATION_ID;
  private readonly CREATE_TEMPLATE_URL = `${process.env.NFT_API_ENDPOINT}/api/apps/${this.APPLICATION_ID}/contracts/${this.CONTRACT_ID}/token-types`;
  private readonly MINT_NFT_URL = `${process.env.NFT_API_ENDPOINT}/api/apps/${this.APPLICATION_ID}/contracts/${this.CONTRACT_ID}/tokens/non-fungible`;
  private readonly TRANSFER_NFT_URL = `${process.env.WALLET_API_ENDPOINT}/api/transactions/execute`;

  constructor(
    @InjectRepository(TemplateRepository)
    private templateRepository: TemplateRepository,
    private authService: AuthService,
  ) {}

  public async createTemplate(dto: CreateTemplateDto): Promise<NFT | void> {
    const contractId = this.CONTRACT_ID;
    const url = this.CREATE_TEMPLATE_URL;
    const accessToken = await this.authService.getAccessToken();

    const template = await axios
      .post(url, dto, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        return response.data;
      })
      .catch((error) => console.log(error));

    if (template) {
      const _template = {
        templateId: template.id,
        contractId: contractId,
        name: template.name,
      };

      await this.templateRepository.saveTemplate(_template);
    }

    return template;
  }

  public async getTemplates(): Promise<NFT[] | void> {
    const accessToken = await this.authService.getAccessToken();
    const url = `${process.env.NFT_API_ENDPOINT}/api/apps/${this.APPLICATION_ID}/contracts/${this.CONTRACT_ID}/token-types`;

    const templates = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    return templates;
  }

  public async getTemplateById(typeId: number): Promise<NFT | void> {
    const accessToken = await this.authService.getAccessToken();
    const url = `${process.env.NFT_API_ENDPOINT}/api/apps/${this.APPLICATION_ID}/contracts/${this.CONTRACT_ID}/token-types/${typeId}`;

    const template = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    return template;
  }

  private async updateTemplate(typeId: number): Promise<NFT | void> {
    const contractId = this.CONTRACT_ID;
    const url = `${process.env.NFT_API_ENDPOINT}/api/apps/${this.APPLICATION_ID}/contracts/${this.CONTRACT_ID}/token-types/${typeId}`;
    const accessToken = await this.authService.getAccessToken();

    const template = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    if (template) {
      const _template = {
        templateId: template.id,
        contractId: contractId,
        name: template.name,
        maxSupply: template.maxSupply,
        currentSupply: template.currentSupply,
      };

      await this.templateRepository.saveTemplate(_template);
    }
  }
}