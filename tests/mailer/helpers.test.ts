import { describe, it } from "std/testing/bdd.ts";
import { assertStringIncludes, assertRejects, assertInstanceOf, assertEquals } from "std/testing/asserts.ts";

import { getHtmlTemplate, getJsonContent, populateContent, populateTemplate } from "@mailer/helpers.ts";
import { ContentName, TemplateName } from "@mailer/typings.d.ts";

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

describe("getJsonContent", () => {
  it("should get default json content", async () => {
    const json = await getJsonContent();

    assertInstanceOf(
      json, 
      Object, 
      "json content not found"
    );
  });

  it("should throw an error if json content not found", () => {
    const contentName = "content1" as unknown as ContentName;
    const error = async () => 
      await getJsonContent(contentName);

    assertRejects(
      error,
      Error,
      `Error reading content file: ${contentName}`
    );
  });
});

describe("populateTemplate", () => {
  it("should replace placeholders with values", () => {
    const template = "<html><head><title>{{title}}</title></head><body>{{content}}</body></html>";
    const values = {
      title: "Test Title",
      content: "Hello, World!",
    };

    const expectedResult = "<html><head><title>Test Title</title></head><body>Hello, World!</body></html>";
    const result = populateTemplate(template, values);
    console.log(result);

    assertEquals(result, expectedResult);
  });
});

describe("populateContent", () => {
  it("should replace placeholders with values in JSON content", () => {
    const content = `{
      "subject": "Welcome {{username}}!",
      "body": "Hello, {{username}}! Thank you for joining us."
    }`;
    const values = {
      username: "JohnDoe",
    };

    const expectedResult = `{
      "subject": "Welcome JohnDoe!",
      "body": "Hello, JohnDoe! Thank you for joining us."
    }`;
    const result = populateContent(content, values);
    console.log(result);

    assertEquals(result, expectedResult);
  });
});