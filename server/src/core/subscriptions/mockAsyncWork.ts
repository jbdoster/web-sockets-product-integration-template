import { Subscription } from "../../core/types";

const mockAsyncWork: Subscription = (message) =>
    new Promise(resolve => setInterval(_ => resolve({
        value: Math.random(),
    }), 3000));

export default mockAsyncWork;