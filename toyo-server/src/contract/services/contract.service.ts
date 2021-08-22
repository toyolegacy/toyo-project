import { CreateContractDto } from '../dto/create-contract.dto';
import { Body, Injectable } from '@nestjs/common';
import axios from 'axios';
import { config } from 'dotenv';
import { AuthService } from '../../auth/services/auth.service';

config();

@Injectable()
export class ContractService {
  private readonly DATA_URL = `${process.env.NFT_API_ENDPOINT}/api/apps/${process.env.APPLICATION_ID}/contracts`;

  constructor(private authService: AuthService) {}

  public async createContract(
    @Body() dto: CreateContractDto,
  ): Promise<Record<string, any>> {
    const accessToken = await this.authService.getAccessToken();
    const url = this.DATA_URL;

    return await axios
      .post(url, dto, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log(error));
  }
}
