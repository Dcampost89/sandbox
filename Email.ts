export class Email {
  recipients: string;
  subject: string;
  template: string;
  body: string;
  formUrl: string;

  constructor(
    recipients: string,
    subject: string,
    template: string,
    formUrl: string
  ) {
    this.recipients = recipients;
    this.subject = subject;
    this.template = template;
    this.formUrl = formUrl;
    this.init();
  }

  private init() {
    const template = HtmlService.createTemplateFromFile(this.template);
    template.form_link = this.formUrl;
    const html = template.evaluate();
    const output = HtmlService.createHtmlOutput(html).getContent();
    this.body = output;
  }

  public sendEmail() {
    MailApp.sendEmail({
      to: this.recipients,
      subject: this.subject,
      htmlBody: this.body
    });
  }
}
