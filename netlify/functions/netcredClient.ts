
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

    public async getAuthenticatedCompanyId(): Promise<string | null> {
        await this.ensureAuthenticated();
        return this.companyId;
    }

    public async ensureAuthenticated() {
        const currentApiUrl = (process.env.NETCRED_API_URL || "https://api.sandbox.netcredbrasil.com.br/graphql").trim();
        // Reset and re-auth if URL changed OR token expired
        if (!this.token || Date.now() > this.tokenExpiry || (this.lastApiUrl && this.lastApiUrl !== currentApiUrl)) {
            await this.authenticate();
        }
    }

    private async authenticate() {
        const username = (process.env.NETCRED_USERNAME || "").trim();
        const password = (process.env.NETCRED_PASSWORD || "").trim();
        const apiUrl = (process.env.NETCRED_API_URL || "https://api.sandbox.netcredbrasil.com.br/graphql").trim();

        if (!username || !password) {
            throw new Error(`NetCred credentials not configured. USER: ${username ? 'OK' : 'MISSING'}, PASS: ${password ? 'OK' : 'MISSING'}`);
        }

        console.log(`[NetCredClient] Authenticating against: ${apiUrl}`);
        console.log(`[NetCredClient] Debug Data: U=${username.substring(0, 3)}... (len: ${username.length}), P=${password.substring(0, 2)}... (len: ${password.length})`);

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
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query,
                variables: { username, password }
            })
        });

        const data = await response.json();

        if (data.errors) {
            console.error("[NetCredClient] GraphQL Protocol Errors:", JSON.stringify(data.errors));
            throw new Error(`NetCred GraphQL Protocol Error: ${data.errors[0]?.message || "Unknown"}`);
        }

        const auth = data.data?.tokenAuth;

        if (auth?.errors && auth.errors.length > 0) {
            const errorMsg = auth.errors.map((e: any) => `${e.field || 'General'}: ${e.message}`).join(', ');
            console.error(`[NetCredClient] Auth Rejection: ${errorMsg}`);
            throw new Error(`NetCred Auth Refused: ${errorMsg}`);
        }

        if (!auth?.token) {
            console.error("[NetCredClient] Auth Error: No token in response", JSON.stringify(data));
            throw new Error("NetCred Auth Error: Token not found in response");
        }

        this.token = auth.token;
        this.companyId = auth.user?.company?.id || null;
        this.lastApiUrl = apiUrl;

        // Set expiry to 23 hours (assuming 24h token)
        this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
    }

    public async request(query: string, variables: any = {}) {
        await this.ensureAuthenticated();

        const currentApiUrl = process.env.NETCRED_API_URL || "https://api.sandbox.netcredbrasil.com.br/graphql";

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
