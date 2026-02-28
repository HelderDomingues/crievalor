
const NETCRED_API_URL = process.env.NETCRED_API_URL || "https://api.sandbox.netcredbrasil.com.br/graphql";

export class NetCredClient {
    private static instance: NetCredClient;
    private token: string | null = null;
    private tokenExpiry: number = 0;
    private companyId: string | null = null;

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

        if (!username || !password) {
            throw new Error("NetCred credentials not configured");
        }

        const query = `
      mutation tokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
          token
          user {
            company {
              id
            }
          }
        }
      }
    `;

        const response = await fetch(NETCRED_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query,
                variables: { username, password }
            })
        });

        const data = await response.json();
        if (data.errors || !data.data?.tokenAuth) {
            console.error("[NetCredClient] Auth API Error:", data.errors);
            throw new Error(`NetCred Auth Error: ${JSON.stringify(data.errors || "Failed to get token")}`);
        }

        this.token = data.data.tokenAuth.token;
        this.companyId = data.data.tokenAuth.user?.company?.id || null;

        // Set expiry to 23 hours (assuming 24h token)
        this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
    }

    public async request(query: string, variables: any = {}) {
        if (!this.token || Date.now() > this.tokenExpiry) {
            await this.authenticate();
        }

        const response = await fetch(NETCRED_API_URL, {
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
