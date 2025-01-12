import { STATUS_CODES } from "http";

const statusMessages: Record<string, string> = {};

// Normalize the messages (e.g., "Not Found" -> "Not found.").
for (const code in STATUS_CODES) {
  const message = STATUS_CODES[code] as string;
  statusMessages[code] = message[0] + message.slice(1).toLowerCase() + ".";
}

// Manually process the messages with abbreviations.
statusMessages[200] = "OK.";
statusMessages[226] = "IM used.";
statusMessages[414] = "URI too long.";
statusMessages[505] = "HTTP version not supported.";

export default statusMessages;
