
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
      mutation chargeLinkCreate($input: ChargeLinkCreateInput!) {
        chargeLinkCreate(input: $input) {
          chargeLink {
            url
            id
          }
          errors {
            field
            message
          }
        }
      }
    `;

    const result = await this.client.request(query, {
      input: {
        companyId: process.env.NETCRED_COMPANY_ID || "2032",
        title: `${input.planId} (${input.email})`,
        description: input.subscriptionId,
        baseAmount: input.amount,
        subscription: true,
        cardRecurringAllowed: true,
        pixAllowed: false,
        billetAllowed: false,
        rrule: "FREQ=MONTHLY;COUNT=60", // Maximum allowed cycles by NetCred
      }
    });

    // Check for business-logic errors
    if (result.chargeLinkCreate?.errors?.length > 0) {
      const errorMsg = result.chargeLinkCreate.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
      throw new Error(`NetCred chargeLinkCreate error: ${errorMsg}`);
    }

    return result;
  }
}
