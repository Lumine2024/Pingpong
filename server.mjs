import { createServer } from "node:http";
import { readFile, access } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const START_PORT = Number(process.env.PORT ?? "5173");
const ROOT = process.cwd();

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

function getFilePath(urlPath) {
    const parsedUrl = new URL(urlPath, "http://localhost");
    const pathname = parsedUrl.pathname;
    const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const normalized = normalize(requested).replace(/^([.][.][/\\])+/, "");
    return join(ROOT, normalized);
}

async function resolveFilePath(urlPath) {
    const basePath = getFilePath(urlPath);
    try {
        await access(basePath);
        return basePath;
    } catch {
        // Browser ESM needs .js, but TS output may keep extensionless imports like ./ai
        // Try appending .js for extensionless module requests.
        if (!extname(basePath)) {
            const jsPath = `${basePath}.js`;
            await access(jsPath);
            return jsPath;
        }
        throw new Error("Not found");
    }
}

const server = createServer(async (req, res) => {
    if (req.url === "/favicon.ico") {
        res.writeHead(204);
        res.end();
        return;
    }

    try {
        const filePath = await resolveFilePath(req.url ?? "/");
        const data = await readFile(filePath);
        const ext = extname(filePath);
        const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    } catch {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found");
    }
});

function listenWithFallback(port) {
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
        const currentPort = server.address() && typeof server.address() === "object"
            ? server.address().port
            : START_PORT;
        const nextPort = Number(currentPort) + 1;
        console.warn(`Port ${currentPort} is busy, retrying on ${nextPort}...`);
        setTimeout(() => {
            listenWithFallback(nextPort);
        }, 50);
        return;
    }
    throw err;
});

listenWithFallback(START_PORT);
