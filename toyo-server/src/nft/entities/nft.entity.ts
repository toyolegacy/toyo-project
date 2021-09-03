import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'base_Nft' })
export class Nft extends BaseEntity {
  @PrimaryGeneratedColumn()
  nftId?: number;

  @Column({ type: 'int' })
  templateId?: number;

  @Column({ type: 'varchar', length: 256 })
  playerId?: string;

  @Column({ type: 'varchar', length: 64 })
  name?: string;

  @Column({ type: 'int' })
  value?: number;
}
