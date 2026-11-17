import test from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { questions } from "../src/data/questions.ts";
import {
  inbox,
  signals,
  sites,
  siteSignals,
  scenarios,
} from "../src/data/labs.ts";
import { trainingDomain, storageKey } from "../src/utils/training.ts";

test(
  "production training, labs, assessment, persistence and mobile navigation",
  { timeout: 180000 },
  async (t) => {
    const browser = await chromium.launch({
      headless: true,
      executablePath: process.env.CHROMIUM_PATH || undefined,
    });
    t.after(() => browser.close());
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    });
    const failures = [];
    page.on("pageerror", (e) => failures.push(String(e)));
    const base = "https://academy.example";
    const assets = new Set(await readdir("dist/assets"));
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== base)
        throw Error("Unexpected network request: " + url.origin);
      if (url.pathname === "/")
        return route.fulfill({ path: resolve("dist/index.html") });
      const name = url.pathname.slice("/assets/".length);
      if (url.pathname.startsWith("/assets/") && assets.has(name))
        return route.fulfill({ path: resolve("dist/assets", name) });
      return route.fulfill({ status: 404, body: "Missing asset" });
    });
    const click = (name) =>
      page.getByRole("button", { name, exact: true }).click();
    const choice = (text) =>
      page.locator(".choices button").filter({ hasText: text }).click();
    const heading = (name) =>
      page.getByRole("heading", { name, exact: true }).waitFor();
    const progress = () =>
      page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
    await page.goto(base);
    const dots=page.locator(".signal-dots circle");
    assert.equal(await dots.count(),128);
    await click("Pause icon animation");
    await page.waitForFunction(()=>document.querySelector(".signal-dots circle").getAnimations()[0]?.playState==="paused");
    const formations=await dots.evaluateAll(elements=>{
      return [0,1,2,3].map(shape=>{
        const points=elements.map(dot=>{
          dot.getAnimations()[0].currentTime=4600*(shape+0.5);
          const matrix=new DOMMatrix(getComputedStyle(dot).transform);
          return [Math.round(matrix.e),Math.round(matrix.f)];
        });
        return JSON.stringify(points);
      });
    });
    assert.equal(new Set(formations).size,4);
    await click("Play icon animation");
    await page.waitForFunction(()=>document.querySelector(".signal-dots circle").getAnimations()[0]?.playState==="running");
    await page.emulateMedia({reducedMotion:"reduce"});
    await page.getByRole("img",{name:"An envelope drawn in mint dots"}).waitFor();
    await page.waitForFunction(()=>document.querySelector(".signal-dots circle").getAnimations().length===0);
    await page.emulateMedia({reducedMotion:"no-preference"});
    if (process.env.QA_SCREENSHOT)
      await page.screenshot({ path: process.env.QA_SCREENSHOT });
    await page.getByRole("link", { name: "Start learning" }).click();
    await page.getByRole("link", { name: "Begin first lesson" }).click();
    for (let i = 0; i < 6; i++) {
      const q = questions.find((q) => q.topic === i);
      await page.locator(".choices button").nth(q.correct).click();
      await page
        .getByText("Correct. Module completed.", { exact: false })
        .waitFor();
      if (i < 5) await page.getByRole("link", { name: "Next module" }).click();
    }
    assert.equal((await progress()).lessons.length, 6);
    for (const kind of ["mail", "url", "social"]) {
      await page.goto(base + "/#/labs/" + kind);
      const list = kind === "mail" ? inbox : kind === "url" ? sites : scenarios;
      for (const [n, item] of list.entries()) {
        if (kind === "mail") {
          await choice(item.flags.length ? "Suspicious" : "Likely legitimate");
          for (const flag of item.flags)
            await page.getByLabel(signals[flag]).check();
        } else if (kind === "url") {
          const index = item.choices.indexOf(trainingDomain(item.url));
          await page
            .locator(".choices")
            .first()
            .locator("button")
            .nth(index)
            .click();
          await choice(siteSignals[siteSignals.indexOf(item.signal)]);
        } else {
          if (n === 0) {
            await choice(item.risky);
            await choice(item.finish);
            assert.equal((await progress()).cases.includes("social-0"), false);
          }
          await choice(item.safe);
          await choice(item.finish);
        }
        if (kind !== "social") {
          await click("Check findings");
          await page.getByText("Correct findings", { exact: true }).waitFor();
        }
        if (n < list.length - 1) await click("Next case →");
      }
    }
    assert.equal((await progress()).cases.length, 22);
    await page.goto(base + "/#/assessment");
    await click("Begin assessment");
    for (let i = 0; i < 15; i++) {
      const prompt = await page.locator(".article h2").innerText();
      const q = questions.find((q) => q.prompt === prompt);
      await page.locator(".choices button").nth(q.correct).click();
      await click(i === 14 ? "Submit assessment" : "Next question");
    }
    await heading("Assessment results");
    assert.equal(await page.locator(".review details").count(), 15);
    assert.equal(new Set((await progress()).attempts[0].ids).size, 15);
    await heading("15 / 15");
    await click("Try again");
    for (let i = 0; i < 15; i++) {
      const prompt = await page.locator(".article h2").innerText();
      const q = questions.find((q) => q.prompt === prompt);
      await page.locator(".choices button").nth((q.correct + 1) % q.options.length).click();
      await click(i === 14 ? "Submit assessment" : "Next question");
    }
    await heading("0 / 15");
    await page.getByRole("link", { name: "View learning record" }).click();
    await page.reload();
    await heading("Coursework completed");
    await click("Reset progress");
    await click("Keep progress");
    assert.equal((await progress()).attempts.length, 2);
    assert.match(
      await page.locator(".stats .card").last().innerText(),
      /15\/15/,
    );
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.locator(".top").isVisible(), false);
    await page.emulateMedia({ media: "screen" });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Overview" })
      .click();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await page.goto(base + "/#/progress");
    await click("Reset progress");
    await click("Erase progress");
    assert.deepEqual((await progress()).lessons, []);
    assert.deepEqual((await progress()).cases, []);
    assert.deepEqual((await progress()).attempts, []);
    assert.deepEqual(failures, []);
  },
);
