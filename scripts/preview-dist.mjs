import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function getPathname(url) {
  try {
    return decodeURIComponent(new URL(url, `http://${host}`).pathname);
  } catch {
    return "/";
  }
}

function resolveRequestPath(pathname) {
  const cleanPath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = resolve(dist, `.${sep}${cleanPath}`);

  if (!absolutePath.startsWith(dist)) {
    return null;
  }

  return absolutePath;
}

async function getFilePath(pathname) {
  const requestPath = resolveRequestPath(pathname);

  if (!requestPath) {
    return null;
  }

  if (!existsSync(requestPath)) {
    return null;
  }

  const info = await stat(requestPath);

  if (info.isDirectory()) {
    return join(requestPath, "index.html");
  }

  return requestPath;
}

const server = createServer(async (request, response) => {
  try {
    const pathname = getPathname(request.url);
    const filePath = await getFilePath(pathname);

    if (!filePath || !existsSync(filePath)) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "content-type":
        contentTypes[extname(filePath)] || "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Internal error");
  }
});

server.listen(port, host, () => {
  console.log(`Previewing dist at http://${host}:${port}/`);
});
