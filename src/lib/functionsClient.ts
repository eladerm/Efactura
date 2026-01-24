
'use client';

const BASE_URL = "https://us-central1-studio-1175223924-14ab3.cloudfunctions.net";
const MAX_RETRIES = 3;
const INITIAL_DELAY = 500; // ms

interface FetchOptions {
    method?: "GET" | "POST";
    body?: Record<string, any>;
    timeout?: number; // in ms
}

/**
 * A robust client to call Firebase Cloud Functions with retry and timeout logic.
 * @param functionName The name of the function to call.
 * @param options Fetch options including method, body, and timeout.
 * @returns The JSON response from the function.
 */
export async function callCloudFunction(
  functionName: string,
  options: FetchOptions = {}
): Promise<any> {
    const { method = "GET", body, timeout = 15000 } = options;
    const url = `${BASE_URL}/${functionName}`;

    console.log(`[functionsClient] Calling ${method} ${url}`, body || "");

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const fetchOptions: RequestInit = {
                method,
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                },
            };

            if (method === "POST" && body) {
                fetchOptions.body = JSON.stringify(body);
            }

            const response = await fetch(url, fetchOptions);
            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorBody;
                try {
                    errorBody = await response.json();
                } catch {
                    errorBody = await response.text();
                }
                console.error(`[functionsClient] Error on attempt ${attempt + 1}: ${response.status} ${response.statusText}`, errorBody);
                throw new Error(`HTTP error! status: ${response.status}, body: ${JSON.stringify(errorBody)}`);
            }

            const data = await response.json();
            console.log(`[functionsClient] Success for ${functionName}`, data);
            return data;
        } catch (error: any) {
            clearTimeout(timeoutId);
            console.error(`[functionsClient] Attempt ${attempt + 1} failed for ${functionName}:`, error.message);

            const isRetryable =
                error.name === "AbortError" || // Timeout
                error.message.includes("ECONNRESET") ||
                error.message.includes("ETIMEDOUT") ||
                error.message.includes("fetch failed");

            if (isRetryable && attempt < MAX_RETRIES - 1) {
                const delay = INITIAL_DELAY * Math.pow(2, attempt);
                console.log(`[functionsClient] Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error(`[functionsClient] All retries failed for ${functionName}.`);
                throw error;
            }
        }
    }
}
