import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as cors from "cors";

// Inicializa el middleware de CORS para permitir peticiones desde cualquier origen.
const corsHandler = cors({origin: true});

// 1. ping: Verifica conectividad básica con el backend.
export const ping = onRequest((req, res) => {
  corsHandler(req, res, () => {
    logger.info("ping ok");
    res.json({ok: true, message: "El backend de funciones está respondiendo."});
  });
});

// The rest of the functions (sriPing, checkP12, etc.) have been migrated
// to Next.js Server Actions to improve reliability and simplify the architecture.
// You can find them in `src/app/actions/sri-tests.ts`.
// This `index.ts` is kept minimal for basic deployment checks.
