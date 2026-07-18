import { spawn } from "node:child_process";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "site");
const localOrigin = "http://localhost:3000";
const publicOrigin = (process.env.SITE_ORIGIN ?? localOrigin).replace(/\/$/, "");
const routes = ["/", "/personalization", "/givenchy", "/19h03", "/about"];

function routeHref(route, currentRoute) {
  const prefix = currentRoute === "/" ? "" : "../";
  if (route === "/") return currentRoute === "/" ? "./" : "../";
  return `${prefix}${route.slice(1)}/`;
}

function prepareHtml(source, currentRoute) {
  const documentEnd = source.indexOf("</html>");
  let html = documentEnd >= 0 ? source.slice(0, documentEnd + 7) : source;

  html = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b(?=[^>]*\brel=["']modulepreload["'])[^>]*>/gi, "")
    .replace(/\sdata-rsc-[\w-]+=["'][^"']*["']/gi, "")
    .replaceAll(localOrigin, publicOrigin)
    .replace(/\b(href|src)=["']\/(?!\/)([^"']*)["']/gi, (match, attribute, target) => {
      const pathOnly = `/${target.replace(/\/$/, "")}`;
      if (routes.includes(pathOnly)) {
        return `${attribute}="${routeHref(pathOnly, currentRoute)}"`;
      }

      const prefix = currentRoute === "/" ? "" : "../";
      return `${attribute}="${prefix}${target}"`;
    });

  const canonicalPath = currentRoute === "/" ? "/" : `${currentRoute}/`;
  return html.replace(
    "</head>",
    `<link rel="canonical" href="${publicOrigin}${canonicalPath}"/></head>`,
  );
}

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(localOrigin, { signal: AbortSignal.timeout(500) });
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("The production server did not start in time.");
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await cp(path.join(projectRoot, "dist/client"), outputRoot, { recursive: true });
await rm(path.join(outputRoot, "_headers"), { force: true });

const server = spawn("npm", ["run", "start"], {
  cwd: projectRoot,
  env: { ...process.env, NO_COLOR: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

try {
  await waitForServer();

  for (const route of routes) {
    const response = await fetch(`${localOrigin}${route}`);
    if (!response.ok) throw new Error(`Could not render ${route}: HTTP ${response.status}`);

    const html = prepareHtml(await response.text(), route);
    const routeDirectory = route === "/" ? outputRoot : path.join(outputRoot, route.slice(1));
    await mkdir(routeDirectory, { recursive: true });
    await writeFile(path.join(routeDirectory, "index.html"), html);
  }

  await writeFile(path.join(outputRoot, ".nojekyll"), "");
  console.log(`Exported ${routes.length} routes to ${outputRoot}`);
} catch (error) {
  if (serverOutput) process.stderr.write(serverOutput);
  throw error;
} finally {
  server.kill("SIGTERM");
}
