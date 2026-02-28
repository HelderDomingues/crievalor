
import { Config, Context } from "@netlify/functions";

export abstract class BaseController {
    protected abstract handleRequest(req: Request, context: Context): Promise<Response>;

    public async handler(event: any, context: Context): Promise<any> {
        // Detect if environment is providing modern Request (V2) or legacy Event (V1)
        const isV2 = event instanceof Request;
        let request: Request;

        if (isV2) {
            request = event;
        } else {
            // Convert Legacy Event to Request object
            const url = `https://${event.headers.host}${event.path}`;
            request = new Request(url, {
                method: event.httpMethod,
                headers: event.headers,
                body: event.body ? (event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body) : null
            });
        }

        try {
            const response = await this.handleRequest(request, context);

            if (isV2) return response;

            // Convert Response to Legacy Object
            const body = await response.text();
            const headers: any = {};
            response.headers.forEach((v, k) => { headers[k] = v; });

            return {
                statusCode: response.status,
                headers,
                body
            };
        } catch (error: any) {
            console.error(`[BaseController] Error:`, error);
            const status = error.status || 500;
            const body = JSON.stringify({ error: error.message || "Internal Server Error" });

            if (isV2) {
                return new Response(body, { status, headers: { "Content-Type": "application/json" } });
            }

            return {
                statusCode: status,
                headers: { "Content-Type": "application/json" },
                body
            };
        }
    }
}
