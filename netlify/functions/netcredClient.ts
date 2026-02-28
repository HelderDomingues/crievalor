
export class NetCredClient {
    private static instance: NetCredClient;
    private token: string | null = null;
    private tokenExpiry: number = 0;
    private companyId: string | null = null;
    private lastApiUrl: string | null = null;

    private constructor() { }

    public static getInstance(): NetCredClient {
        if (!NetCredClient.instance) {
            NetCredClient.instance = new NetCredClient();
        }
        return NetCredClient.instance;
    }

    public getAuthenticatedCompanyId(): string | null {
        return this.companyId;
    }

    private async authenticate() {
        const username = process.env.NETCRED_USERNAME;
        const password = process.env.NETCRED_PASSWORD;
        const apiUrl = process.env.NETCRED_API_URL || "https://api.sandbox.netcredbrasil.com.br/graphql";

        if (!username || !password) {
            throw new Error("NetCred credentials not configured (NETCRED_USERNAME/PASSWORD)");
        }

        console.log(`[NetCredClient] Authenticating against ${apiUrl}...`);

        const query = `
      mutation tokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
          token
          errors {
            field
            message
          }
          user {
            company {
              id
            }
          }
        }
      }
    `;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query,
                variables: { username, password }
            })
        });

        const data = await response.json();

        if (data.errors) {
            throw new Error(`NetCred GraphQL Auth Error: ${JSON.stringify(data.errors)}`);
        }

        const auth = data.data?.tokenAuth;

        if (auth?.errors && auth.errors.length > 0) {
            const errorMsg = auth.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
            throw new Error(`NetCred Auth Refused: ${errorMsg}`);
        }

        if (!auth?.token) {
            throw new Error("NetCred Auth Error: Token not found in response");
        }

        this.token = auth.token;
        this.companyId = auth.user?.company?.id || null;
        this.lastApiUrl = apiUrl;

        // Set expiry to 23 hours (assuming 24h token)
        this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
        console.log(`[NetCredClient] Auth success. Company ID: ${this.companyId}`);
    }

    public async request(query: string, variables: any = {}) {
        const currentApiUrl = process.env.NETCRED_API_URL || "https://api.sandbox.netcredbrasil.com.br/graphql";

        // Reset and re-auth if URL changed OR token expired
        if (!this.token || Date.now() > this.tokenExpiry || this.lastApiUrl !== currentApiUrl) {
            await this.authenticate();
        }

        const response = await fetch(currentApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${this.token}`
            },
            body: JSON.stringify({ query, variables })
        });

        const data = await response.json();
        if (data.errors) {
            console.error("[NetCredClient] Request Errors:", data.errors);
            throw new Error(`NetCred API Error: ${data.errors[0]?.message || "Unknown error"}`);
        }

        return data.data;
    }
}
