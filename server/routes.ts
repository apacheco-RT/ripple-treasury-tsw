import type { Express } from "express";
import type { Server } from "http";
import path from "path";
import fs from "fs";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import archiver from "archiver";

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many feedback submissions, please try again later." },
});

const downloadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many download requests, please try again in a few minutes.",
});

let cachedPrototypeHtml: string | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;
let buildInProgress = false;

async function buildPrototypeHtml(): Promise<string> {
  const { execSync } = await import("child_process");
  execSync("npx vite build", { cwd: path.resolve("."), stdio: "pipe", timeout: 60000 });

  const distDir = path.resolve("dist/public");
  const htmlPath = path.join(distDir, "index.html");
  if (!fs.existsSync(htmlPath)) {
    throw new Error("Build failed — index.html not found.");
  }

  let html = fs.readFileSync(htmlPath, "utf-8");
  const assetsDir = path.join(distDir, "assets");

  html = html.replace(
    /<link\s+rel="stylesheet"\s+crossorigin\s+href="\/assets\/(index-[^"]+\.css)"\s*\/?>/g,
    (_match, filename) => {
      const cssPath = path.join(assetsDir, filename);
      if (fs.existsSync(cssPath)) {
        const css = fs.readFileSync(cssPath, "utf-8");
        return `<style>${css}</style>`;
      }
      return _match;
    }
  );

  html = html.replace(
    /<script\s+type="module"\s+crossorigin\s+src="\/assets\/(index-[^"]+\.js)"\s*><\/script>/g,
    (_match, filename) => {
      const jsPath = path.join(assetsDir, filename);
      if (fs.existsSync(jsPath)) {
        const js = fs.readFileSync(jsPath, "utf-8");
        return `<script type="module">${js}</script>`;
      }
      return _match;
    }
  );

  html = html.replace(
    /<link\s+rel="modulepreload"\s+crossorigin\s+href="\/assets\/([^"]+\.js)"\s*\/?>/g,
    (_match, filename) => {
      const jsPath = path.join(assetsDir, filename);
      if (fs.existsSync(jsPath)) {
        const js = fs.readFileSync(jsPath, "utf-8");
        return `<script type="module">${js}</script>`;
      }
      return _match;
    }
  );

  const logoPath = path.join(distDir, "logo.svg");
  if (fs.existsSync(logoPath)) {
    const logoSvg = fs.readFileSync(logoPath, "utf-8");
    const b64 = Buffer.from(logoSvg).toString("base64");
    html = html.replace(/["']\/logo\.svg["']/g, `"data:image/svg+xml;base64,${b64}"`);
  }

  const faviconPath = path.join(distDir, "favicon.png");
  if (fs.existsSync(faviconPath)) {
    const favBuf = fs.readFileSync(faviconPath);
    const b64 = favBuf.toString("base64");
    html = html.replace(/["']\/favicon\.png["']/g, `"data:image/png;base64,${b64}"`);
  }

  const standaloneScript = `<script>window.__STANDALONE_PROTOTYPE__=true;</script>`;
  html = html.replace('</head>', standaloneScript + '</head>');

  return html;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.feedback.create.path, feedbackLimiter, async (req, res) => {
    try {
      const input = api.feedback.create.input.parse(req.body);
      const result = await storage.createFeedback(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get("/download/project-zip", (_req, res) => {
    const rootDir = path.resolve(".");
    const EXCLUDE_DIRS = new Set([".git", "node_modules", ".cache", ".local", ".config", ".upm", "replit-project", "dist", ".vite"]);
    const EXCLUDE_FILES = new Set(["zipFile.zip", "ripple-treasury-tsw.tar.gz", "ripple-treasury-tsw.zip", ".breakpoints", ".replit", "replit.nix"]);

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=ripple-treasury-tsw.zip");
    res.setHeader("Cache-Control", "no-cache");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", () => res.status(500).end());
    archive.pipe(res);

    function addDir(dirPath: string, archivePath: string) {
      const entries = fs.readdirSync(dirPath);
      for (const entry of entries) {
        if (EXCLUDE_DIRS.has(entry) || EXCLUDE_FILES.has(entry)) continue;
        const fullPath = path.join(dirPath, entry);
        const arcPath = path.join(archivePath, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          addDir(fullPath, arcPath);
        } else {
          archive.file(fullPath, { name: arcPath });
        }
      }
    }

    addDir(rootDir, "");
    archive.finalize();
  });

  app.get("/api/download-prototype", downloadLimiter, async (_req, res) => {
    if (buildInProgress) {
      return res.status(429).send("A build is already in progress. Please try again shortly.");
    }

    try {
      const now = Date.now();
      if (cachedPrototypeHtml && (now - cacheTimestamp) < CACHE_TTL_MS) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=ripple-treasury-prototype.html");
        res.setHeader("Cache-Control", "no-cache");
        return res.send(cachedPrototypeHtml);
      }

      buildInProgress = true;
      const html = await buildPrototypeHtml();
      cachedPrototypeHtml = html;
      cacheTimestamp = Date.now();
      buildInProgress = false;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Content-Disposition", "attachment; filename=ripple-treasury-prototype.html");
      res.setHeader("Cache-Control", "no-cache");
      res.send(html);
    } catch (err) {
      buildInProgress = false;
      console.error("Prototype download build error:", err);
      res.status(500).send("Failed to build prototype for download.");
    }
  });

  return httpServer;
}
