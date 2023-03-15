import { ContentName, JsonContent, TemplateName } from "@mailer/typings.d.ts";

/** The default template name used when no template name is provided to the getHtmlTemplate function. */
const DEFAULT_TEMPLATE_NAME: TemplateName = 'template';

/** The default content name used when no content name is provided to the getJsonContent function. */
const DEFAULT_CONTENT_NAME: ContentName = 'content';

/**
 * Replaces placeholders in the given content string with their corresponding
 * values from the provided values object.
 *
 * @param {string} content - The content string containing placeholders wrapped in {{ }}.
 * @param {Record<string, string>} values - An object containing keys that match the placeholders in the content and their respective replacement values.
 * @returns {string} - The content string with placeholders replaced by their corresponding values.
 */
export function populateContent(content: string, values: Record<string, string>): string {
  const keys = Object.keys(values);

  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      const placeholder = new RegExp(`{{${key}}}`, "g");
      const value = values[key];
      content = content.replace(placeholder, value);
    }
  });

  return content;
}

/**
 * Populates the given HTML template by replacing the placeholders with the provided values.
 *
 * @param {string} template - The HTML template content as a string.
 * @param {Object} values - An object containing the keys and values to replace in the template.
 * @returns {string} The populated HTML template.
 */
export function populateTemplate(template: string, values: { [key: string]: string }): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      return values[key];
    }
    return `{{${key}}}`;
  });
}

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