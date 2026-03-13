import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { Configschema, ModuleParams } from "@gsps-layouts/types";

export async function setup({
  nodecg,
  logger,
  config,
}: ModuleParams<{
  ws: Configschema["externalWS"];
  obs: Configschema["obs"];
}>) {
  const externalWSConfig = config.ws;
  const OBSconfig = config.obs;

  const port = externalWSConfig.port;
  const server = http.createServer();
  const wss = new WebSocketServer({ server });
  const clients = new Set<WebSocket>();

  server.listen(port, "0.0.0.0", () => {
    logger.info(`WebSocket server listening on port ${port}`);
  });

  wss.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
    const socket = req.socket;
    const remoteAddress = socket.remoteAddress;
    const remotePort = socket.remotePort;
    const clientId = `${remoteAddress}:${remotePort}`;

    clients.add(ws);

    logger.info(`WebSocket client ${clientId} connected`);

    ws.on("close", () => {
      clients.delete(ws);
      logger.info(`WebSocket client ${clientId} disconnected`);
    });

    ws.on("error", (err: any) => {
      logger.error(`WebSocket error from ${clientId}:`, err);
    });
  });

  const broadcast = (event: string, data: unknown) => {
    const payload = JSON.stringify({ event, data });

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  };

  if (OBSconfig.enabled) {
    const offAirScenes = [
      OBSconfig.scenes!.countdown,
      OBSconfig.scenes!.intermission,
      OBSconfig.scenes!.video,
    ];
    logger.debug("off air scenes:", offAirScenes);

    nodecg.listenFor("OBSSceneChanged", (data, ack) => {
      logger.debug("scene changed to:", data.sceneName);
      try {
        const onAir = !offAirScenes.includes(data.sceneName);
        broadcast("onAir", onAir);

        if (ack && !ack.handled) {
          ack(null, { ok: true });
        }
      } catch (err) {
        logger.error("Failed to handle OBSSceneChanged:", err);
        if (ack && !ack.handled) {
          ack(err instanceof Error ? err.message : "Unknown error");
        }
      }
    });
  }
}
