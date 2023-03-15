import { ContentName, JsonContent, TemplateName } from "@mailer/typings.d.ts";

/** The default template name used when no template name is provided to the getHtmlTemplate function. */
const DEFAULT_TEMPLATE_NAME: TemplateName = 'template';

/** The default content name used when no content name is provided to the getJsonContent function. */
const DEFAULT_CONTENT_NAME: ContentName = 'content';

/**
 * Reads a JSON content file and returns its content as an object.
 *
 * @param {ContentName} contentName - The name of the content file without the extension.
 * @returns {Promise<Object>} A promise that resolves to the content of the JSON file.
 * @throws {Error} If there is an error reading the content file.
 */
export async function getJsonContent(contentName: ContentName = DEFAULT_CONTENT_NAME): Promise<JsonContent> {
  try {
    const filePath = `./src/mailer/content/${contentName}.json`;
    return JSON.parse(await Deno.readTextFile(filePath));
  } catch (error) {
    console.error(error);
    throw new Error(`Error reading content file: ${contentName}`);
  }
}

/**
 * Reads an HTML template file and returns its content as a string.
 *
 * @param {string} templateName - The name of the template file without the extension.
 * @returns {Promise<string>} A promise that resolves to the content of the template file.
 * @throws {Error} If there is an error reading the template file.
 */
export async function getHtmlTemplate(templateName: TemplateName = DEFAULT_TEMPLATE_NAME): Promise<string> {
  try {
    const filePath = `./src/mailer/templates/${templateName}.html`;
    return await Deno.readTextFile(filePath);
  } catch (error) {
    console.error(error);
    throw new Error(`Error reading template file: ${templateName}`);
  }
}