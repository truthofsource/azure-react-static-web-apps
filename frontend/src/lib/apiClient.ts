export const serviceAvailabilityHelp = "The feature or a supporting service may be paused, switched off, or temporarily unavailable. Ask an Admin to check whether the feature and its supporting services are enabled.";

/** Preserve useful server/validation messages; translate empty/native transport errors. */
export function describeRequestError(error: unknown, fallbackMessage: string): string {
  const fallback = fallbackMessage.trim() || "This action could not be completed. Reload its current status before trying again.";
  const message = error instanceof Error && typeof error.message === "string" ? error.message.trim() : "";
  if (/^(failed to fetch|fetch failed|load failed|network ?error(?: when attempting to fetch resource)?[.!]?|network request failed)$/i.test(message)) {
    return `${fallback} ${serviceAvailabilityHelp} Check your connection. If you were saving or sending, reload the saved status before trying again to avoid a duplicate.`;
  }
  if (error instanceof Error && error.name === "TimeoutError") {
    return `${fallback} The service did not respond in time. ${serviceAvailabilityHelp} If you were saving or sending, reload the saved status before trying again.`;
  }
  if (/^(?:Failed to execute ['"]json['"]|Unexpected end of JSON input|Unexpected token.*(?:JSON|json))/i.test(message)) {
    return `${fallback} The returned data could not be read. Reload the current saved status before trying again; contact an Admin if it continues.`;
  }
  return message || fallback;
}

export function responseFallback(response: Response, fallbackMessage: string): string {
  const steps: Record<number, string> = {
    401: "Your sign-in or secure session may have expired. Sign in again, or reopen your secure invitation link.",
    403: "Your current access does not allow this action. Ask an Admin to check your access.",
    404: "The requested record or service could not be found. Refresh the list and select it again.",
    409: "The saved record may have changed or may not allow this action. Reload its current status before trying again.",
    413: "The upload is too large. Choose a smaller file within the size limit shown on this page.",
    415: "This file or request format is not supported. Use one of the formats listed on this page.",
    429: "The service is limiting requests. Wait before trying again; do not repeatedly click the action.",
    502: `${serviceAvailabilityHelp} If you were saving or sending, check the saved status before trying again.`,
    503: `${serviceAvailabilityHelp} If you were saving or sending, check the saved status before trying again.`,
    504: `The service did not respond in time. ${serviceAvailabilityHelp} If you were saving or sending, check the saved status before trying again.`,
  };
  return `${fallbackMessage} ${steps[response.status] ?? (response.status >= 500
    ? `${serviceAvailabilityHelp} If you were saving or sending, check the saved status before trying again.`
    : "Check the entered values and current saved status before trying again.")}`;
}

function getApiErrorMessage(responseBody: unknown, fallbackMessage: string) {
  if (responseBody && typeof responseBody === "object") {
    const apiError = responseBody as {
      code?: unknown;
      validation?: unknown;
      detail?: unknown;
      error?: unknown;
      message?: unknown;
    };

    if (
      apiError.code === "invalid_csv" &&
      apiError.validation &&
      typeof apiError.validation === "object" &&
      "message" in apiError.validation &&
      typeof apiError.validation.message === "string" &&
      apiError.validation.message.trim().length > 0
    ) {
      // CSV validation messages already include the file and row when available.
      return apiError.validation.message;
    }

    if (typeof apiError.detail === "string" && apiError.detail.trim().length > 0) {
      return apiError.detail;
    }

    if (typeof apiError.error === "string" && apiError.error.trim().length > 0) {
      return apiError.error;
    }
    if (typeof apiError.message === "string" && apiError.message.trim().length > 0) {
      return apiError.message;
    }
  }

  return fallbackMessage;
}

export class ApiResponseError extends Error {
  readonly responseBody: unknown;
  constructor(message: string, responseBody: unknown) {
    super(message);
    this.name = "ApiResponseError";
    this.responseBody = responseBody;
  }
}

export function responseErrorMessage(response: Response, body: unknown, fallback: string): string {
  let message = getApiErrorMessage(body, responseFallback(response, fallback));
  if (/^(unauthorized|forbidden|access denied|internal server error|request failed)\.?$/i.test(message.trim())) {
    message = responseFallback(response, fallback);
  }
  // Preserve known causes and actionable provider messages, such as a busy converter.
  if (response.status >= 500 && !/\b(wait|use|choose|refresh|reload|contact|ask|try|check|sign in|open)\b/i.test(message)) {
    message += ` ${serviceAvailabilityHelp} If you were saving or sending, reload the saved status before trying again.`;
  }
  return message;
}

export function isUnreadableApiResponse(error: unknown): boolean {
  return error instanceof ApiResponseError && error.responseBody !== null
    && typeof error.responseBody === "object" && "unreadableResponse" in error.responseBody
    && error.responseBody.unreadableResponse === true;
}

export async function readJsonApiResponse<T>(
  response: Response,
  fallbackMessage: string
) {
  let responseBody: unknown;
  try {
    responseBody = await response.json();
    // Scalar JSON cannot confirm the API's record/action responses; lists remain valid.
    if (responseBody === null || typeof responseBody !== "object") throw new Error("invalid_response_shape");
  }
  catch { throw new ApiResponseError(`${response.ok ? fallbackMessage : responseFallback(response, fallbackMessage)} The service returned an empty or unreadable response. If you were saving or sending, reload its saved status before trying again.`, { status: response.status, unreadableResponse: true }); }

  if (!response.ok) {
    throw new ApiResponseError(responseErrorMessage(response, responseBody, fallbackMessage), responseBody);
  }

  return responseBody as T;
}
