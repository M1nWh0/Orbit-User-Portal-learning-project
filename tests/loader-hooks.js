import { pathToFileURL } from 'node:url';
import path from 'node:path';

export function resolve(specifier, context, nextResolve) {
	if (specifier.startsWith('$lib/')) {
		const filePath = path.resolve('src/lib', specifier.slice(5));
		return {
			format: 'module',
			shortCircuit: true,
			url: pathToFileURL(filePath).href
		};
	}
	if (specifier === '$app/environment') {
		return {
			format: 'module',
			shortCircuit: true,
			url: 'data:text/javascript,export const dev = process.env.NODE_ENV !== "production"; export const browser = false; export const building = false;'
		};
	}
	return nextResolve(specifier, context);
}
