//cron job is a scheduled task that runs automatically at a fixed time

// ┌──────── minute (0–59)
// │ ┌────── hour (0–23)
// │ │ ┌──── day of month (1–31)
// │ │ │ ┌── month (1–12)
// │ │ │ │ ┌─ day of week (0–7)
// * * * * *

// @hourly	Run once an hour at the beginning of the hour	0 * * * *
// @daily	Run once a day at midnight	0 0 * * *
// @weekly	Run once a week at midnight on Sunday	0 0 * * 0
// @monthly	Run once a month at midnight on the first day	0 0 1 * *
// @yearly	Run once a year at midnight on January 1st	0 0 1 1 *

import cron from "cron";
import https from "https";
import "dotenv/config";

// job runs every 14 minutes
const job = new cron.CronJob("*/14 * * * *", () => {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) {
        console.log("Get request successful");
      } else {
        console.log("Get request failed");
      }
    })
    .on("error", (err) => {
      console.log(err);
    });
});
export default job;
