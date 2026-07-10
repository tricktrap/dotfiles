#!/usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const getBudgetStatus = () => {
  // Look for the litellm budget in the workspace directory
  const budgetDataRaw = fs.readFileSync("/tmp/budget_info.json");
  const budgetData = JSON.parse(budgetDataRaw);

  return {
    limit: budgetData.user_info.max_budget,
    spent: budgetData.user_info.spend,
  };
};

const getResourceStatus = () => {
  const costDataRaw = fs.readFileSync("/tmp/carbon.json");
  const costData = JSON.parse(costDataRaw);

  return {
    electricity_watt_hours: costData.carbon.electricity_wh,
    carbon_dioxide_grams: costData.carbon.carbon_gco2,
    water_milliliters: costData.carbon.water_ml
  };
};

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const data = JSON.parse(input);
  const model = data.model?.display_name || "??";
  const dir = path.basename(data.workspace?.current_dir || "??");
  const cost = data.cost?.total_cost_usd || 0;
  const pct = Math.floor(data.context_window?.used_percentage || 0);
  const durationMs = data.cost?.total_duration_ms || 0;

  const CYAN = "\x1b[36m",
    GREEN = "\x1b[32m",
    YELLOW = "\x1b[33m",
    RED = "\x1b[31m",
    RESET = "\x1b[0m";

  const barColor = pct >= 90 ? RED : pct >= 70 ? YELLOW : GREEN;
  const filled = Math.floor(pct / 10);
  const bar = "█".repeat(filled) + "░".repeat(10 - filled);

  const mins = Math.floor(durationMs / 60000);
  const secs = Math.floor((durationMs % 60000) / 1000);

  let branch = "";
  try {
    branch = execSync("git branch --show-current", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
    branch = branch ? ` | 🌿 ${branch}` : "";
  } catch {}

  let budget = "";
  try {
    const { limit, spent } = getBudgetStatus();

    budget = ` | 💰 $${spent.toFixed(2)} / $${limit.toFixed(2)}`;
  } catch { }

  let resources = "";
  try {
    const { electricity_watt_hours, carbon_dioxide_grams, water_milliliters } = getResourceStatus();

    resources = ` | ⚡️ ${(electricity_watt_hours / 1000.0).toFixed(2)} kWh 🏎️ ${(carbon_dioxide_grams / 1000.0).toFixed(2)} kg CO2 💧${(water_milliliters / 1000.0).toFixed(1)} L`
  } catch { }

  console.log(`${CYAN}[${model}]${RESET} 📁 ${dir}${branch}`);
  console.log(
    `${barColor}${bar}${RESET} ${pct}% | ${YELLOW}$${cost.toFixed(2)}${RESET} | ⏱️ ${mins}m ${secs}s${budget}${resources}`,
  );
});
