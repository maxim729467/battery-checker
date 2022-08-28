const notifier = require("node-notifier");
const si = require("systeminformation");
const cron = require("node-cron");
const path = require("path");

let shouldNotify = true;

const BATTERY_LEVEL = {
  MAX: 95,
  MIN: 15,
};

const notify = (message) =>
  notifier.notify({
    contentImage: path.join(__dirname, "battery.png"),
    title: "Battery level",
    sticky: true,
    sound: "Hero",
    message,
  });

cron.schedule("* * * * *", async () => {
  try {
    const { isCharging, percent } = await si.battery();
    let message;

    if (percent === BATTERY_LEVEL.MIN && !isCharging && shouldNotify) {
      message = `Battery is at ${percent}%. Plug in charging cabel.`;
      notify(message);
      shouldNotify = false;
      return;
    }

    if (percent === BATTERY_LEVEL.MAX && isCharging && shouldNotify) {
      message = `Battery is at ${percent}%. Unplug charging cabel.`;
      notify(message);
      shouldNotify = false;
      return;
    }

    if (percent !== BATTERY_LEVEL.MIN && percent !== BATTERY_LEVEL.MAX) {
      shouldNotify = true;
    }

  } catch (err) {
    console.log(err);
  }
});
