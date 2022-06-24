const net = require("net");

const client = new net.Socket();
client.connect("/tmp/rofi_notification_daemon", () => client.write("list\n"));
let result = "";
client.on("data", function (data) {
  result += data.toString();
});


 
  client.on("end", function () {
    try {
        const notification = JSON.parse(result);
        const firefoxNotifications = notification.filter((notification) =>
          notification.application.toLowerCase().includes("firefox")
        );
        const otherNotifications = notification.filter(
          (notification) =>
            !notification.application.toLowerCase().includes("firefox")
        );
        if (firefoxNotifications.length === 0 && otherNotifications.length === 0) {
          return console.log("0");
        }
        if (firefoxNotifications.length > 0 && otherNotifications.length === 0) {
          return console.log(`${firefoxNotifications.length} priority`);
        }
        if (otherNotifications.length > 0 && firefoxNotifications.length === 0) {
          return console.log(`${otherNotifications.length} non-priority`);
        }
    
        if (otherNotifications.length > 0 && firefoxNotifications.length > 0) {
          return console.log(
            `${firefoxNotifications.length} priority  | ${otherNotifications.length} non-priority`
          );
        }
      } catch (error) {
        console.log("error", error);
      }
    client.close()
  });