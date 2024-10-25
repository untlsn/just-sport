// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server';

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/favicon.ico" />
					<title>Untlsn-Template</title>
					{assets}
				</head>
				<body class="bg-bg-0 min-h-screen">
					<div id="app">{children}</div>
					{scripts}
				</body>
			</html>
		)}
	/>
));
