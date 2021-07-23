import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePlayerUserInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField!: number;
}
