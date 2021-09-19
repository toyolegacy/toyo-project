import { NFT } from '@arkane-network/arkane-connect/dist/src/models/wallet/NFT';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { TokenService } from '../services/token.service';
import { MintTokenDto } from '../dto/mint-token.dto';
export declare class TokenController {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    createTemplate(dto: CreateTemplateDto): Promise<NFT | void>;
    getTemplates(): Promise<NFT[] | void>;
    getTemplateById(typeId: number): Promise<NFT | void>;
    mintToken(dto: MintTokenDto): Promise<Array<Record<string, string | number>> | void>;
}