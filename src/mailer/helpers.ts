import { TemplateName } from "./typings.d.ts";

/** The default template name used when no template name is provided to the getHtmlTemplate function. */
const DEFAULT_TEMPLATE_NAME: TemplateName = 'template';

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