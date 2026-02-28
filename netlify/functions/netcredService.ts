
import { NetCredClient } from "./netcredClient";

export class NetCredService {
  private client = NetCredClient.getInstance();

  async createCheckout(input: {
    planId: string;
    userId: string;
    email: string;
    name: string;
    amount: number;
    paymentMethods: string[];
    subscriptionId: string;
  }) {
    const query = `
      mutation createSubscriptionLink($input: SubscriptionLinkInput!) {
        createSubscriptionLink(input: $input) {
          url
          id
        }
      }
    `;

    return await this.client.request(query, {
      input: {
        externalId: `${input.subscriptionId}_${Date.now()}`,
        name: input.name,
        email: input.email,
        value: input.amount,
        paymentMethods: input.paymentMethods,
        // NetCred specific fields will go here
      }
    });
  }
}
