import { describe, it } from "std/testing/bdd.ts";
import { assertStringIncludes, assertRejects, assertInstanceOf } from "std/testing/asserts.ts";

import { getHtmlTemplate } from "@mailer/helpers.ts";
import { TemplateName } from "@mailer/typings.d.ts";

describe("getHtmlTemplate", () => {
  it("should get default html template", async () => {
    const doctype = "<!DOCTYPE html>";
    const html = await getHtmlTemplate();

    assertStringIncludes(
      html, 
      doctype, 
      "html template not found"
    );
  });

  it("should throw an error if error reading html template", () => {
    const templateName = "template1" as unknown as TemplateName;
    const error = async () => 
      await getHtmlTemplate(templateName);

    assertRejects(
      error,
      Error,
      `Error reading template file: ${templateName}`
    );
  });
});