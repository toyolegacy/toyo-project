"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../auth/services/auth.service");
const typeorm_1 = require("@nestjs/typeorm");
const template_repository_1 = require("../repositories/template.repository");
const nft_repository_1 = require("../repositories/nft.repository");
const axios_1 = require("axios");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let NftService = class NftService {
    constructor(templateRepository, nftRepository, authService) {
        this.templateRepository = templateRepository;
        this.nftRepository = nftRepository;
        this.authService = authService;
        this.ADMIN_ADDRESS = '0x560fA4ccE918f9A4924218b7Ff86124C22ADFbc6';
        this.CONTRACT_TRANSACTION_HASH = '0xb679dac2e7cbe77eed47aa68caa2e9a86a35c2763140ffae6bb30935ccbc3000';
        this.CONTRACT_ADDRESS = '0x4ef2ab3c77fe8c311836db3fc4dc0b111d9667ae';
        this.CONTRACT_ID = 1111;
        this.APPLICATION_ID = process.env.APPLICATION_ID;
        this.CREATE_TEMPLATE_URL = `${process.env.NFT_API_ENDPOINT}/api/apps/${this.APPLICATION_ID}/contracts/${this.CONTRACT_ID}/token-types`;
        this.MINT_NFT_URL = `${process.env.NFT_API_ENDPOINT}/api/apps/${this.APPLICATION_ID}/contracts/${this.CONTRACT_ID}/tokens/non-fungible`;
        this.TRANSFER_NFT_URL = `${process.env.WALLET_API_ENDPOINT}/api/transactions/execute`;
    }
    async createTemplate(dto) {
        const contractId = this.CONTRACT_ID;
        const url = this.CREATE_TEMPLATE_URL;
        const accessToken = await this.authService.getAccessToken();
        const template = await axios_1.default
            .post(url, dto, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
            console.log(response.data);
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
    async getTemplates() {
        const accessToken = await this.authService.getAccessToken();
        const url = `${process.env.NFT_API_ENDPOINT}/api/apps/${this.APPLICATION_ID}/contracts/${this.CONTRACT_ID}/token-types`;
        const templates = await axios_1.default
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
    async getTemplateById(typeId) {
        const accessToken = await this.authService.getAccessToken();
        const url = `${process.env.NFT_API_ENDPOINT}/api/apps/${this.APPLICATION_ID}/contracts/${this.CONTRACT_ID}/token-types/${typeId}`;
        console.log(url);
        const template = await axios_1.default
            .get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
            console.log('GET TEMPLATE BY ID', response.data);
            return response.data;
        })
            .catch((error) => {
            console.log(error);
        });
        return template;
    }
    async updateTemplate(typeId) {
        const contractId = this.CONTRACT_ID;
        const url = `${process.env.NFT_API_ENDPOINT}/api/apps/${this.APPLICATION_ID}/contracts/${this.CONTRACT_ID}/token-types/${typeId}`;
        const accessToken = await this.authService.getAccessToken();
        const template = await axios_1.default
            .get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
            console.log('UPDATING TEMPLATE', response.data);
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
    async mintNft(dto) {
        let i = 0;
        const nftArray = [];
        const contractId = this.CONTRACT_ID;
        const url = this.MINT_NFT_URL;
        const wallet = this.ADMIN_ADDRESS;
        const typeId = dto.typeId;
        const quantity = dto.quantity;
        const accessToken = await this.authService.getAccessToken();
        const _dto = {
            typeId: typeId,
            destinations: [wallet],
        };
        for (i; i < quantity; ++i) {
            console.log('👷 Preparing the NFT Template to be minted');
            const nft = await axios_1.default
                .post(url, _dto, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                console.log('👷 You minted a new NFT!');
                console.log(response.data[0]);
                return response.data[0];
            })
                .catch((error) => console.log(error));
            if (nft) {
                console.log('👷 Saving new NFT on database...');
                const _nft = {
                    nftId: nft.tokenIds[0],
                    templateId: typeId,
                    contractId: contractId,
                    name: nft.metadata.name,
                };
                nftArray.push(_nft);
                await this.nftRepository.saveNft(_nft);
                await this.updateTemplate(typeId);
            }
        }
        console.log(nftArray);
        return nftArray;
    }
};
NftService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(template_repository_1.TemplateRepository)),
    __param(1, (0, typeorm_1.InjectRepository)(nft_repository_1.NftRepository)),
    __metadata("design:paramtypes", [template_repository_1.TemplateRepository,
        nft_repository_1.NftRepository,
        auth_service_1.AuthService])
], NftService);
exports.NftService = NftService;
//# sourceMappingURL=nft.service.js.map