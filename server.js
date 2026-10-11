// The Noor Corner — self-hosted PeerJS signaling broker.
// Free-tier Node host (Render free web service). This ONLY handles the
// signaling handshake (WebSocket); all media stays P2P WebRTC.
// Health check: GET /health -> "ok" (used by uptime pings to prevent sleep).
const express = require("express");
const { ExpressPeerServer } = require("peer");

const app = express();
app.get("/health", (_req, res) => res.send("ok"));

const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () => {
  console.log(`noor-corner-signaling listening on ${PORT}`);
});

const peerServer = ExpressPeerServer(server, {
  path: "/",
  proxied: true, // behind Render's reverse proxy — trust X-Forwarded-* headers
  allow_discovery: false, // don't let strangers list peer ids
});
app.use("/", peerServer);
