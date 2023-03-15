/**
 * @type
 * Represents valid template names for the email templates.
 * Add more valid template names to this type by extending the union type.
 */
export type TemplateName = 
  | 'template'
  | 'welcome'
  | 'confirmation'

/**
 * @type
 * Represents valid content names for the email content.
 * Add more valid content names to this type by extending the union type.
 */
export type ContentName = 
| 'content'
| 'marketing'
| 'transactional'

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
    button: {
      label: string;
      url: string;
    };
  };
};

/**
 * @type
 * Represents an email object with a subject and a body.
 */
export type Email = {
  subject: string;
  body: string;
};
