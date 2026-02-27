
import { Config, Context } from "@netlify/functions";

export abstract class BaseController {
    protected abstract handleRequest(req: Request, context: Context): Promise<Response>;

    public async handler(req: Request, context: Context): Promise<Response> {
        try {
            return await this.handleRequest(req, context);
        } catch (error: any) {
            console.error(`[BaseController] Error:`, error);
            return new Response(JSON.stringify({
                error: error.message || "Internal Server Error"
            }), {
                status: error.status || 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }
}
