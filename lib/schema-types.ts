import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import {
  speakers,
  conference,
  users,
  about,
  committees,
  faq,
  committeeType,
  committee_members,
  call_for_paper,
  important_dates,
  submission,
  venue,
  organizers,
  agenda,
  registration,
  registered_user,
  submission_file,
  design_guidelines
} from './schema';
import { z } from 'zod';

export const speakerSchema = createInsertSchema(speakers);
export const speakerSelectSchema = createSelectSchema(speakers);

export const conferenceSchema = createInsertSchema(conference);
export const conferenceSelectSchema = createSelectSchema(conference);

export const usersSchema = createInsertSchema(users);
export const usersSelectSchema = createSelectSchema(users);

export type usersType = z.infer<typeof usersSchema>;
export type conferenceType = z.infer<typeof conferenceSchema>;

export const aboutSchema = createInsertSchema(about);
export const aboutSelectSchema = createSelectSchema(about);

export type aboutType = z.infer<typeof aboutSchema>;
export type speakerType = z.infer<typeof speakerSchema>;

export const committeeSchema = createInsertSchema(committees);
export const committeeSelectSchema = createSelectSchema(committees);

export const faqSchema = createInsertSchema(faq);
export const faqSelectSchema = createSelectSchema(faq);

export type faqType = z.infer<typeof faqSchema>;
export type committeeType = z.infer<typeof committeeSchema>;

export const committeeMembersSchema = createInsertSchema(committee_members);
export const committeeMembersSelectSchema =
  createSelectSchema(committee_members);

export type committeeMembersType = z.infer<typeof committeeMembersSchema>;
export type committeeSelectType = z.infer<typeof committeeSelectSchema>;

export const callForPaperSchema = createInsertSchema(call_for_paper);
export const callForPaperSelectSchema = createSelectSchema(call_for_paper);

export type callForPaperType = z.infer<typeof callForPaperSchema>;
export type callForPaperSelectType = z.infer<typeof callForPaperSelectSchema>;

export const importantDatesSchema = createInsertSchema(important_dates);
export const importantDatesSelectSchema = createSelectSchema(important_dates);

export type importantDatesType = z.infer<typeof importantDatesSchema>;

export const submissionSchema = createInsertSchema(submission);
export const submissionSelectSchema = createSelectSchema(submission);

export type submissionType = z.infer<typeof submissionSchema>;
export type importantDatesSelectType = z.infer<
  typeof importantDatesSelectSchema
>;

export const venueSchema = createInsertSchema(venue);
export const venueSelectSchema = createSelectSchema(venue);

export type venueType = z.infer<typeof venueSchema>;

export const organizerSchema = createInsertSchema(organizers);
export const organizerSelectSchema = createSelectSchema(organizers);

export type organizerType = z.infer<typeof organizerSchema>;

export const agendaSchema = createInsertSchema(agenda);
export const agendaSelectSchema = createSelectSchema(agenda);

export type agendaType = z.infer<typeof agendaSchema>;

export const registrationSchema = createInsertSchema(registration);
export const registrationSelectSchema = createSelectSchema(registration);

export type registrationType = z.infer<typeof registrationSchema>;

export const registeredUserSchema = createInsertSchema(registered_user);
export const registeredUserSelectSchema = createSelectSchema(registered_user);

export type registeredUserType = z.infer<typeof registeredUserSchema>;

export const submissionFileSchema = createInsertSchema(submission_file);
export const submissionFileSelectSchema = createSelectSchema(submission_file);

export type submissionFileType = z.infer<typeof submissionFileSchema>;

export const designGuidelinesSchema = createInsertSchema(design_guidelines);
export const designGuidelinesSelectSchema =
  createSelectSchema(design_guidelines);

export type designGuidelinesType = z.infer<typeof designGuidelinesSchema>;
