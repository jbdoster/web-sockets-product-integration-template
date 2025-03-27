export type Message = {
    eventKey: string;
    data: Record<string, unknown>;
    sessionId: string;
    version: number;
}

type Data = Record<string, unknown>;

export type Subscription = (message: Message) => Promise<Data>;
