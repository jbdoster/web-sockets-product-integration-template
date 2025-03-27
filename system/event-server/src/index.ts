import * as system from "./core/system";
import subscriptions from "./core/subscriptions";
import validation from "./core/event-validation";
import { io } from "./core";
import { UserCommunication } from "./core/events/index";

const main = async () => {
  let rules: io.api.EventRules.DataAccessObject[];
  try {
      rules = await io.api.EventRules.fetch();
  }
  catch(error: any) {
      console.error("Could not fetch rules: " + error.message);
      throw new Error("Could not fetch rules.");
  }

  const webSockerServer = new system.WebSocketServer({
    /**
     *  Just a mock right now so we can focus on live data.
     *  A real production implementation could perform various
     *  operations like:
     *    - JWKS endpoint JWT signature verification by authorization server
     *    - session and JWT verification through the database
     */
    authCallback: (sessionId) => Promise.resolve(true),
    eventValidationCallback: (message) => {
      try {
        validation(message, rules);
        return true;
      }
      catch(error) {
        return false;
      }
    },
  });
  
  /**
   *  Messages emitted through the memory stream should already
   *  have been authenticated and validated at this point.
   */
  webSockerServer.on("client_message", async (message) => {
    const job = subscriptions.get(message.eventKey);
    if (!job) {
      webSockerServer.emit("client_request_error", {
        ...message,
        data: {
          userDisplayText: "An error occured. Please try again later or reach out to customer support.",
        }
      });
    }
    else {
      try {
        await job(message);
        const userDisplayText = UserCommunication[message.eventKey].success;
        webSockerServer.emit("client_request_success", {
          ...message,
          data: {
            userDisplayText,
          }
        });
      }
      catch (error: any) {
        console.error("Job error: " + error.message);
        const userDisplayText = UserCommunication[message.eventKey].error;
        webSockerServer.emit("client_request_error", {
          ...message,
          data: {
            userDisplayText,
          }
        });
      }
    }
  })
}

main();
