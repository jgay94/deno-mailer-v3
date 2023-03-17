import { config } from "std/dotenv/mod.ts";

import {
  ContentKey,
  ContentName,
  ContentValues,
  JsonContent,
  MessageOptions,
  SendEmailOptions,
  Sender,
  TemplateName,
} from "@mailer/typings.d.ts";

const env = await config({ safe: true });

/** The default template file name used when no template name is provided to the getHtmlTemplate function. */
const DEFAULT_TEMPLATE_NAME: TemplateName = "template";

/** The default content file name used when no content name is provided to the getJsonContent function. */
const DEFAULT_CONTENT_NAME: ContentName = "content";

export async function sendEmail(options: SendEmailOptions): Promise<Response> {
  const apiKey = env.MAILER_API_KEY;
  const baseUrl = env.MAILER_BASE_URL;
  const url = new URL("/v3/smtp/email", baseUrl);

  // First, validate the sender's email
  if (options.sender && !validateEmail(options.sender.email)) {
    throw new Error("Invalid sender email");
  }

  // Then, validate the emails of the receivers
  options.to.forEach((receiver) => {
    if (!validateEmail(receiver.email)) {
      throw new Error("Invalid receiver email");
    }
  });

  // Get the JSON content
  const jsonContent = await getJsonContent(
    options.contentKey,
    options.contentName,
  );
  const content = jsonContent[options.contentKey];

  // Call the createEmail function to generate the email content
  const htmlContent = await createEmail(
    options.contentKey,
    options.values,
    options.templateName,
    options.contentName,
  );

  const messageOptions: MessageOptions = {
    sender: options.sender ||
      { name: "Your Company", email: "joseph@josephgay.net" },
    to: options.to,
    subject: content.subject,
    htmlContent: htmlContent,
  };

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "api-key": apiKey,
  };

  const body: BodyInit = JSON.stringify(messageOptions);

  const request: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  const response = await fetch(url, request);
  return response;
}

/**
 * Validates an email address using a regex pattern.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
export function validateEmail(email: string): boolean {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

export async function createEmail(
  contentKey: ContentKey,
  values?: Partial<ContentValues>,
  templateName?: TemplateName,
  contentName?: ContentName,
): Promise<string> {
  try {
    const htmlTemplate = await getHtmlTemplate(templateName);
    const jsonContent = await getJsonContent(contentKey, contentName);
    const content = jsonContent[contentKey];
    console.log(content);

    const populatedBody = populateContentBody(content.body, values);
    console.log(populatedBody);

    const populatedHtml = htmlTemplate
      .replace(/{{title}}/g, content.subject)
      .replace(/{{domain}}/g, values?.domain || "https://example.com")
      .replace(/{{body}}/g, populatedBody)
      .replace(
        /{{buttonURL}}/g,
        content.callToAction.url.replace("{{domain}}", values?.domain || ""),
      )
      .replace(/{{buttonLabel}}/g, content.callToAction.label);

    return populatedHtml;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating email");
  }
}

/**
 * Replaces placeholders in the content body with corresponding values and formats new lines.
 *
 * @param body - The content body as a string.
 * @param values - An object containing the values to replace placeholders.
 * @returns A formatted content body string with placeholders replaced and new lines formatted.
 */
export function populateContentBody(
  body: string,
  values: Partial<ContentValues> = {},
): string {
  const lines = body.split("\n");

  const populatedLines = lines.map((line) => {
    let populatedLine = line;
    Object.keys(values).forEach((key) => {
      const value = values[key as keyof ContentValues];
      populatedLine = populatedLine.replace(
        new RegExp(`{{values.${key}}}`, "g"),
        value || "",
      );
    });

    populatedLine = populatedLine.replace("{{domain}}", values?.domain || "");

    return `<p style="
      color: #7e8890;
      font-family: 'Source Sans Pro', helvetica, sans-serif;
      font-size: 15px;
      font-weight: normal;
      Margin: 0;
      Margin-bottom: 15px;
      line-height: 1.6;
    ">${populatedLine}</p>`;
  });

  return populatedLines.join("\n");
}

/**
 * Returns a JSON content object for the given content key.
 *
 * @param {ContentKey} contentKey - The key of the content object in the JSON content file.
 * @returns {Promise<JsonContent>} A Promise that resolves to a JsonContent object with the requested content.
 * @throws {Error} If there is an error reading the content file.
 */
export async function getJsonContent(
  contentKey: ContentKey,
  contentName: ContentName = DEFAULT_CONTENT_NAME,
): Promise<JsonContent> {
  try {
    const filePath = `./src/mailer/content/${contentName}.json`;
    const json = JSON.parse(await Deno.readTextFile(filePath));
    return {
      [contentKey]: json[contentKey],
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Error reading content file: ${contentName}.json`);
  }
}

/**
 * Reads an HTML template file and returns its content as a string.
 *
 * @param {TemplateName} templateName - The name of the template file without the extension.
 * @returns {Promise<string>} A promise that resolves to the content of the template file.
 * @throws {Error} If there is an error reading the template file.
 */
export async function getHtmlTemplate(
  templateName: TemplateName = DEFAULT_TEMPLATE_NAME,
): Promise<string> {
  try {
    const filePath = `./src/mailer/templates/${templateName}.html`;
    return await Deno.readTextFile(filePath);
  } catch (error) {
    console.error(error);
    throw new Error(`Error reading template file: ${templateName}.html`);
  }
}
