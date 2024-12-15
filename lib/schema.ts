import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  pgEnum,
  date,
  integer,
  boolean,
  unique
} from 'drizzle-orm/pg-core';

export const speakerTypeEnum = pgEnum('type', [
  'COMMITEE',
  'CHAIRS',
  'SPEAKER'
]);

export const committeeType = pgEnum('commitee_type_enum', [
  'ORGANIZERS',
  'SPEAKERS',
  'COMMITTEE'
]);

// export const degreeType = pgEnum('degree_type_enum', [
//   'DOCTOR',
//   'MASTER',
//   'BACHELOR'
// ]);

export const userType = pgEnum('user_type_enum', ['ADMIN', 'USER']);

export const speakers = pgTable('speakers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),

  bio: text('bio'),
  title: text('title'),
  avatar: text('avatar'),
  country: text('country'),
  // phd or doctor or stuff
  type: speakerTypeEnum('type').default('SPEAKER'),
  conferenceId: integer('conference_id').references(() => conference.id, {
    onDelete: 'cascade'
  })
});

export const conference = pgTable('conference', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  country: text('country'),
  city: text('city'),

  start: date('start').notNull(),
  end: date('end'),

  hero_text: text('hero_text'),
  logo: text('logo'),
  banner: text('banner'),

  location: text('location'),
  video: text('video'),
  map: text('map'),

  isDefault: boolean('is_default').default(false)
});

export const about = pgTable('about', {
  id: serial('id').primaryKey(),
  text: text('text'),
  html: text('html'),
  youtube_url: text('youtube_url'),
  shorter_html: text('shorter_html'),
  conferenceId: integer('conference_id')
    .references(() => conference.id, {
      onDelete: 'cascade'
    })
    .unique()
});

//faqs

export const organizers = pgTable('organizers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  logo: text('logo').notNull(),
  html: text('html'),
  conferenceId: integer('conference_id').references(() => conference.id, {
    onDelete: 'cascade'
  })
});

export const venue = pgTable('venue', {
  id: serial('id').primaryKey(),
  name: text('name').default('Conference Venue'),
  location: text('location'),
  description: text('description'),
  html: text('html'),
  conferenceId: integer('conference_id').references(() => conference.id, {
    onDelete: 'cascade'
  })
});

export const call_for_paper = pgTable('call_for_paper', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  html: text('html'),
  conferenceId: integer('conference_id')
    .references(() => conference.id, {
      onDelete: 'cascade'
    })
    .unique()
});

export const registration = pgTable('registration', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  html: text('html'),
  conferenceId: integer('conference_id').references(() => conference.id, {
    onDelete: 'cascade'
  })
});

export const important_dates = pgTable('important_dates', {
  id: serial('id').primaryKey(),
  title: text('title').default('Important Dates'),
  date: date('date'),
  conferenceId: integer('conference_id').references(() => conference.id, {
    onDelete: 'cascade'
  })
});

export const committees = pgTable('committees', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: committeeType('type').default('COMMITTEE'),

  conferenceId: integer('conference_id').references(() => conference.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  })
});

export const committee_members = pgTable('committee_members', {
  id: serial('id').primaryKey(),
  name: text('name'),
  affilation: text('affilation'),
  country: text('country'),
  avatar: text('avatar'),
  committeeId: integer('committee_id').references(() => committees.id, {
    onDelete: 'cascade'
  })
});

export const faq = pgTable('faq', {
  id: serial('id').primaryKey(),
  question: text('question'),
  answer: text('answer'),
  conferenceId: integer('conference_id').references(() => conference.id, {
    onDelete: 'cascade'
  })
});

export const submission = pgTable('submission', {
  id: serial('id').primaryKey(),
  title: text('title').default('Paper submission'),
  subtitle: text('subtitle').default('Papers can be submitted via'),
  link: text('link'),
  html: text('html'),
  conferenceId: integer('conference_id').references(() => conference.id, {
    onDelete: 'cascade'
  })
});

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    role: userType('role').default('USER'),
    name: text('name')
  },
  (t) => ({
    unq: unique('unique_index_email').on(t.email).nullsNotDistinct()
  })
);

export const agenda = pgTable('agenda', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  start: date('start'),
  end: date('end'),
  html: text('html'),
  conferenceId: integer('conference_id').references(() => conference.id, {
    onDelete: 'cascade'
  })
});

export const cronjob = pgTable('cronjob', {
  id: serial('id').primaryKey(),
  name: text('name'),
  lastRun: date('last_run').defaultNow()
});

export const registered_user = pgTable('registered_user', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  degree: text('degree'),
  position: text('position'),
  organization: text('organization'),
  address_of_organization: text('address_of_organization'),
  phone: text('phone'),
  email: text('email').notNull(),
  country: text('country'),
  zip_code: text('zip_code'),
  is_presenter: boolean('is_presenter').default(false),
  title_of_paper: text('title_of_paper'),
  abstract: text('abstract'),
  profile_picture: text('profile_picture'),
  conferenceId: integer('conference_id').references(() => conference.id, {
    onDelete: 'cascade'
  })
});

export const submission_file = pgTable('submission_file', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  paper: text('paper_file'),
  is_poster: boolean('is_poster').default(false),
  authors: text('authors'),
  conferenceId: integer('conference_id').references(() => conference.id, {
    onDelete: 'cascade'
  })
});

export const design_guidelines = pgTable('design_guidelines', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  html: text('html'),
  conferenceId: integer('conference_id').references(() => conference.id, {
    onDelete: 'cascade'
  })
});

export const agendaRelations = relations(agenda, ({ one }) => ({
  conference: one(conference, {
    fields: [agenda.conferenceId],
    references: [conference.id]
  })
}));

export const conferenceRelations = relations(conference, ({ many, one }) => ({
  speakers: many(speakers),
  about: one(about),
  organizers: many(organizers),
  venue: many(venue),
  call_for_paper: many(call_for_paper),
  registration: many(registration),
  important_dates: many(important_dates),
  committees: many(committees),
  faq: many(faq),
  submission: many(submission),
  agenda: one(agenda)
}));

export const speakerRelations = relations(speakers, ({ one }) => ({
  conference: one(conference, {
    fields: [speakers.conferenceId],
    references: [conference.id]
  })
}));

export const committeeRelations = relations(committees, ({ many, one }) => ({
  committee_members: many(committee_members),
  conference: one(conference, {
    fields: [committees.conferenceId],
    references: [conference.id]
  })
}));

export const faqRelations = relations(faq, ({ one }) => ({
  conference: one(conference, {
    fields: [faq.conferenceId],
    references: [conference.id]
  })
}));

export const organizersRelations = relations(organizers, ({ one }) => ({
  conference: one(conference, {
    fields: [organizers.conferenceId],
    references: [conference.id]
  })
}));

export const venueRelations = relations(venue, ({ one }) => ({
  conference: one(conference, {
    fields: [venue.conferenceId],
    references: [conference.id]
  })
}));

export const callForPaperRelations = relations(call_for_paper, ({ one }) => ({
  conference: one(conference, {
    fields: [call_for_paper.conferenceId],
    references: [conference.id]
  })
}));

export const registrationRelations = relations(registration, ({ one }) => ({
  conference: one(conference, {
    fields: [registration.conferenceId],
    references: [conference.id]
  })
}));

export const importantDatesRelations = relations(
  important_dates,
  ({ one }) => ({
    conference: one(conference, {
      fields: [important_dates.conferenceId],
      references: [conference.id]
    })
  })
);

export const committeeMembersRelations = relations(
  committee_members,
  ({ one }) => ({
    committee: one(committees, {
      fields: [committee_members.committeeId],
      references: [committees.id]
    })
  })
);

export const aboutRelations = relations(about, ({ one }) => ({
  conference: one(conference, {
    fields: [about.conferenceId],
    references: [conference.id]
  })
}));

export const submissionRelations = relations(submission, ({ one }) => ({
  conference: one(conference, {
    fields: [submission.conferenceId],
    references: [conference.id]
  })
}));
