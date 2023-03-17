/**
 * @type
 * Represents valid template file names for the email templates.
 * Add more valid template names to this type by extending the union type.
 */
export type TemplateName =
  | "template"
  | "welcome"
  | "newsletter"
  | "receipt";

/**
 * @type
 * Represents valid content file names for the email content.
 * Add more valid content names to this type by extending the union type.
 */
export type ContentName =
  | "content"
  | "marketing"
  | "transactional";

type CallToAction = {
  label: string;
  url: string;
};

/**
 * @type
 * represents json content as an object with string keys,
 * and values that are objects with a subject,
 * body, and button field.
 */
export type JsonContent = {
  [key: string]: {
    subject: string;
    body: string;
    callToAction: CallToAction;
  };
};

export type ContentKey = keyof JsonContent;

export type ContentValues = {
  commenter: string;
  domain: string;
  email: string;
  friend: string;
  id: string;
  liker: string;
  message: string;
  name: string;
  photo: string;
  plan: string;
  price: string;
  token: string;
  username: string;
};

export type SendEmailOptions = {
  sender?: Sender;
  to: Array<Receiver>;
  templateName?: TemplateName;
  contentName?: ContentName;
  contentKey: ContentKey;
  values?: Partial<ContentValues>;
};

type User = {
  name: string;
  phone: string;
  email: string;
};

export type Sender = Pick<User, "name" | "email">;

type Receiver = Pick<User, "name" | "email">;

export type MessageOptions = {
  sender: Sender;
  to: Array<Receiver>;
  subject: string;
  htmlContent: string;
};
