import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/services/auth.service';
import { NftController } from './controllers/nft.controller';
import { NftService } from './services/nft.service';
import { NftRepository } from './repositories/nft.repository';
import { TemplateRepository } from './repositories/template.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([NftRepository, TemplateRepository]),
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
    }),
  ],
  controllers: [NftController],
  providers: [NftService, AuthService],
  exports: [NftService],
})
export class NftModule {}
