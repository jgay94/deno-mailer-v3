import { sendEmail } from "@mailer/mod.ts";
import {
  createEmail,
  getHtmlTemplate,
  getJsonContent,
  populateContentBody,
} from "@mailer/helpers.ts";
import type { SendEmailOptions } from "@mailer/typings.d.ts";

if (import.meta.main) {
  // const htmlTemplate = await getHtmlTemplate();
  // console.log(htmlTemplate);

  // const jsonContent = await getJsonContent("new-like");
  // console.log(jsonContent);

  // const body = `Thank you for selecting the {{values.plan}} plan. \n Your card has been successfully charged {{values.price}}.`;
  // const values = {
  //   name: "Joe",
  //   domain: "https://example.com",
  // };
  // const bodyContent = populateContentBody(body, values);
  // console.log(bodyContent);

  // const content = {
  //   subject: "Thank you for your purchase",
  //   body: bodyContent,
  //   button: {
  //     label: "View your account",
  //     url: "https://example.com/account",
  //   },
  // };

  const sendEmailOptions: SendEmailOptions = {
    to: [{ name: "Joe", email: "joseph@domersoncapital.com" }],
    contentKey: "new-like",
    values: {
      liker: "Jane",
      username: "janedoe1",
      photo: "012j4az7",
    },
  };

  await sendEmail(sendEmailOptions);
}
