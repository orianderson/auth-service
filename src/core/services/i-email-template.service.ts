export interface IEmailTemplateService {
  confirmEmailTemplate(name: string, link?: string): string;
}
