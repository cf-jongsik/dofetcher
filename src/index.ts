import { DurableObject } from 'cloudflare:workers';

export class FetchDO extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async fetch(request: Request): Promise<Response> {
		return fetch(request);
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const ipAddr = request.headers.get('cf-connecting-ip');
		if (!ipAddr) {
			return new Response('IP address not found', { status: 400 });
		}
		const id: DurableObjectId = env.FETCH_DO.idFromName(ipAddr);
		const stub = env.FETCH_DO.get(id);
		const response = await stub.fetch(request);
		return response;
	},
} satisfies ExportedHandler<Env>;
