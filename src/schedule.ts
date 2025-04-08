var cron = require("node-cron");

export function scheduleDaily(task: () => void, testMode: boolean = false) {
  if (testMode) {
    console.log("🧪 Test mode: running task immediately...");
    task();
    return;
  }

  const randomHour = Math.floor(Math.random() * 14) + 8;
  const randomMinute = Math.floor(Math.random() * 60);
  const cronTime = `${randomMinute} ${randomHour} * * *`;

  console.log(`⏰ Scheduled blog task at ${randomHour}:${randomMinute}`);

  cron.schedule(cronTime, task);
}
