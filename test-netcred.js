import { NetCredClient } from "./netlify/functions/netcredClient.js";
import { NetCredService } from "./netlify/functions/netcredService.js";

// Mock env vars using values from netlify env:list
process.env.NETCRED_API_URL = "https://api.sandbox.netcredbrasil.com.br/graphql";
process.env.NETCRED_USERNAME = "crie.helder";
process.env.NETCRED_PASSWORD = "6WXKnGqTY49bQUwn";
process.env.NETCRED_COMPANY_ID = "2032";

async function run() {
  const service = new NetCredService();
  try {
    const result = await service.createCheckout({
      planId: "v-test",
      userId: "test-user-id",
      email: "test@example.com",
      name: "Test User",
      amount: 100,
      paymentMethods: ["CREDIT_CARD", "PIX"],
      subscriptionId: "test-sub-123",
    });
    console.log("SUCCESS:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("ERROR:", error.message || error);
    if (error.response) console.error(JSON.stringify(error.response, null, 2));
  }
}
run();
