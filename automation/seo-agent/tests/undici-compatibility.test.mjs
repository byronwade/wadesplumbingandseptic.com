import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { promisify } from "node:util";
import test from "node:test";

const execute = promisify(execFile);
const consumers = ["@vercel/blob", "@vercel/sandbox", "eve"];

for (const consumer of consumers) {
	const require = createRequire(
		new URL(`../node_modules/${consumer}/package.json`, import.meta.url),
	);
	const undiciPath = require.resolve("undici");

	test(
		`${consumer}: Undici reads a streamed HTTP response`,
		{ timeout: 10000 },
		async (t) => {
			const server = createServer((_request, response) => {
				response.writeHead(200, { "content-type": "application/json" });
				response.write('{"fixture":');
				response.end('"local-only"}');
			});
			t.after(() => {
				server.closeAllConnections();
				server.close();
			});
			server.listen(0, "127.0.0.1");
			await once(server, "listening");
			const { Agent, request } = require("undici");
			const dispatcher = new Agent();
			t.after(() => dispatcher.close());
			const response = await request(
				`http://127.0.0.1:${server.address().port}`,
				{
					dispatcher,
					headersTimeout: 2000,
					bodyTimeout: 2000,
				},
			);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(await response.body.json(), { fixture: "local-only" });
		},
	);

	test(
		`${consumer}: an unrequested WebSocket subprotocol cannot crash the process`,
		{ timeout: 30000 },
		async (t) => {
			const server = createServer();
			const sockets = new Set();
			let handshakes = 0;
			server.on("connection", (socket) => {
				sockets.add(socket);
				socket.on("close", () => sockets.delete(socket));
				// A crashing client may reset its loopback connection. The child exit
				// and rejection marker below determine the regression result.
				socket.on("error", () => {});
			});
			t.after(() => {
				for (const socket of sockets) socket.destroy();
				server.close();
			});
			server.on("upgrade", (request, socket) => {
				handshakes += 1;
				const accept = createHash("sha1")
					.update(
						`${request.headers["sec-websocket-key"]}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`,
					)
					.digest("base64");
				socket.write(
					[
						"HTTP/1.1 101 Switching Protocols",
						"Upgrade: websocket",
						"Connection: Upgrade",
						`Sec-WebSocket-Accept: ${accept}`,
						"Sec-WebSocket-Protocol: unrequested",
						"\r\n",
					].join("\r\n"),
				);
			});
			server.listen(0, "127.0.0.1");
			await once(server, "listening");
			// An isolated child lets the test observe the original uncaught exception
			// without terminating the test runner. No exception handler masks a crash.
			const { stdout } = await execute(
				process.execPath,
				[
					"-e",
					`const { WebSocket } = require(process.argv[1]);
const socket = new WebSocket(process.argv[2]);
socket.addEventListener("open", () => process.exit(2));
socket.addEventListener("error", () => {
  setTimeout(() => { console.log("REJECTED_WITHOUT_CRASH"); process.exit(0); }, 30);
});`,
					undiciPath,
					`ws://127.0.0.1:${server.address().port}`,
				],
				{ timeout: 15000, windowsHide: true },
			);
			assert.equal(stdout.trim(), "REJECTED_WITHOUT_CRASH");
			assert.equal(handshakes, 1);
		},
	);
}
