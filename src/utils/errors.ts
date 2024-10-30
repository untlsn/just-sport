import type { CustomResponse, RouterResponseInit } from '@solidjs/router';
import { json } from '@solidjs/router';

export type HandledError<T=unknown> = Error & {
	body:  T,
	name:  'HandledError',
	stack: string,
};

export type HandledErrorResponse<T=unknown> = CustomResponse<HandledError<T>> & { isHandledError: true };

/**
 * Wrap error for safe use of polish characters
 * Additionally it give status code 400 by default, so it's highlighted as red in devtools
 */
export function createError<T>(message: string, body?: T, init: RouterResponseInit = { status: 400 }): CustomResponse<HandledError<T>> {
	const err = new Error(message) as HandledError<T>;
	err.name = 'HandledError';
	if (body) err.body = body;
	const res = json(err, init) as HandledErrorResponse<T>;
	res.isHandledError = true;
	return res;
}

export function isHandledError(err: unknown): err is HandledError {
	return err instanceof Error && err.name == 'HandledError';
}

export function isHandledErrorResponse(err: unknown): err is HandledErrorResponse {
	return !!(err instanceof Response && 'isHandledError' in err && err.isHandledError);
}

/**
 * Purge any other type then HandledError to undefined
 * Useful for inlining
 */
export function asHandledError(err: unknown): HandledError | undefined {
	if (isHandledError(err)) return err;
	return undefined;
}

export function pipeHandledError(err: unknown): void {
	if (isHandledErrorResponse(err)) throw err;
	console.error('Unhandled error:', err);
	throw createError('Nieprzewidziany error', err, { status: 500 });
}