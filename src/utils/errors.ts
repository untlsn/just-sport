export type HandledError<T=unknown> = Error & {
	body:  T,
	name:  'HandledError',
	stack: string,
};

/**
 * Wrap error for safe use of polish characters
 * Additionally it give status code 400 by default, so it's highlighted as red in devtools
 */
export function createError<T>(message: string, body?: T): HandledError<T> {
	const err = new Error(encodeURI(message)) as HandledError<T>;
	err.name = 'HandledError';
	if (body) err.body = body;
	return err;
}

export function isHandledError(err: unknown): err is HandledError {
	return err instanceof Error && err.name == 'HandledError';
}

/**
 * Purge any other type then HandledError to undefined
 * Useful for inlining
 *
 * Additionally, it's decode message
 */
export function asHandledError(err: unknown): HandledError | undefined {
	if (!isHandledError(err)) return undefined;
	err.message = decodeURI(err.message);
	return err;
}

export function pipeHandledError(err: unknown): void {
	if (isHandledError(err)) throw err;
	console.error('Unhandled error:', err);
	throw createError('Nieprzewidziany error', err);
}