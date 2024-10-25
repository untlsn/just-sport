import { MetaProvider } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import '~/assets/style';
import TheHeader from './components/TheHeader';

export default function App(): JSXElement {
	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<TheHeader />
					<Suspense>
						<div class="w-320 mx-auto">
							{props.children}
						</div>
					</Suspense>
				</MetaProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
