import mockAsyncWork from "./mockAsyncWork";

import { Subscription } from "../../core/types";

const subscriptions = new Map<string, Subscription>();
subscriptions.set("update_user_profile", mockAsyncWork);

export default subscriptions;
