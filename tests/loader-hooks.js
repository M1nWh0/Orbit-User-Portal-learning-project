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
	return nextResolve(specifier, context);
}
