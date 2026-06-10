import "dotenv/config"; // Load environment variables from .env file
import path from "path";
import {
  After,
  Before,
  IWorldOptions,
  setWorldConstructor,
  Status,
  World,
} from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "@playwright/test";
import { HomePage } from "../../../pages/home-page";
import { DysonManufacturerHomePage } from "../../../pages/dyson-manufacturer-homepage";

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  homePage!: HomePage;
  dysonPage!: DysonManufacturerHomePage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext();
  
  // Only start tracing if TRACE environment variable is set to 'on'
  if (process.env.TRACE === 'on') {
    await this.context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });
  }
  
  this.page = await this.context.newPage();
  this.homePage = new HomePage(this.page);
  this.dysonPage = new DysonManufacturerHomePage(this.page);
});

After(async function (this: CustomWorld, { result }) {
  // Only save trace if it was started
  if (process.env.TRACE === 'on' && this.context) {
    const tracePath = path.join(process.cwd(), "artifacts", `trace-${Date.now()}.zip`);
    await this.context.tracing.stop({ path: tracePath });
  }

  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({ type: "png", fullPage: true });
    await this.attach(screenshot, "image/png");
  }

  if (this.browser) {
    await this.browser.close();
  }
});
