import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

export const ping = onRequest((req, res) => {
  logger.info("ping ok");
  res.json({ ok: true });
});
