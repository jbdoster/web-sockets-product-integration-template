import http from "http";

export default () => {
    http.createServer(function (req, res) {
        res.writeHead(
            200,
            {
                /**
                 * Opt in server to use CORS feature.
                 * Tell browser this server doesn't
                 * care which other servers it shares
                 * with. This is just a mock.
                */
                "access-control-allow-origin": "*",
                "content-type": "application/json",
            },
        );
        /**
         *  Only provide the session ID.
         *  It is linked to the JWT authentication token
         *  as a session in the database.
         *  This way we can authenticate each request by indexing
         *  that ID and give the clients as little information
         *  as possible.
         *  Keeping as much in the back end as possible.
         */
        const mockSessionId = "mock-id-token";
        res.write(JSON.stringify({ sessionId: mockSessionId }));
        res.end();
    }).listen(8081);
}
