
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
    }) {
        const query = `
      mutation createSubscriptionLink($input: SubscriptionLinkInput!) {
        createSubscriptionLink(input: $input) {
          url
          id
        }
      }
    `;

        // Note: This matches the planned implementation in task_plan.md
        return await this.client.request(query, {
            input: {
                externalId: `${input.userId}_${Date.now()}`,
                name: input.name,
                email: input.email,
                value: input.amount,
                paymentMethods: input.paymentMethods,
                // NetCred specific fields will go here
            }
        });
    }
}
