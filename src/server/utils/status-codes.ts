import { STATUS_CODES } from "http";

const statusCodes: Record<string, string> = {};

// Normalize the messages (e.g., "Not Found" -> "Not found.").
for (const code in STATUS_CODES) {
  const message = STATUS_CODES[code] as string;
  statusCodes[code] = message[0] + message.slice(1).toLowerCase() + ".";
}

// Manually process the messages with abbreviations.
statusCodes[200] = "OK.";
statusCodes[226] = "IM used.";
statusCodes[414] = "URI too long.";
statusCodes[505] = "HTTP version not supported.";

export default statusCodes;
