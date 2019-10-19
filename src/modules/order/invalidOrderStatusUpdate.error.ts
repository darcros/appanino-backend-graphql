import { ApolloError } from 'apollo-server-express';

export class InvalidOrderStatusUpdateError extends ApolloError {
  public constructor(message: string) {
    super(message, 'INVALID_ORDER_STATUS_UPDATE');
  }
}
