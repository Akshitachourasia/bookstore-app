//cron job is a scheduled task that runs automatically at a fixed time

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
