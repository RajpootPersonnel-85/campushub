# CampusHub CMS

This folder documents the CMS structure (screens, fields, roles, and workflows) to manage all dynamic content used across the app in `app/`.

You can implement this with any modern headless CMS (Strapi, Payload, Sanity, Keystone) or a self-built admin using Next.js route handlers and a DB. The models below map 1:1 with the API plan in `docs/apis-required.txt`.

## Recommended stacks
- Strapi (SQLite/Postgres) – quick CRUD, roles/permissions, media, relations
- Payload CMS (Mongo/Postgres) – Typescript-first, great access control
- Sanity – flexible portable text, GROQ, image pipelines
- Keystone – Prisma-based, simple lists/relations

## Core collections (high-level)
- Users, Sellers, Books, BookReviews
- Notes, NoteComments
- Jobs
- Hostels
- Deals
- Exams
- Resources
- Schemes
- CommunityPosts, CommunityTags
- CareersRoles
- TiffinVendors, TiffinPlans, TiffinOrders
- WellbeingResources, CounselingSlots, CounselingAppointments, ChatMessages
- SiteSettings, HomeHighlights

## Roles & permissions (example)
- Admin: full access
- Editor: create/update content, publish; no destructive deletes
- Author: create own, update own, submit for review
- Support: read leads, reply
- Vendor: manage own tiffin listings, plans, orders
- Student: limited self data; cannot access CMS

## Workflows
- Draft -> Review -> Published
- Soft delete via `status` or `archivedAt` where needed
- Image/file uploads via CMS media library or S3/GCS

## Environment and integration
- If using Strapi/Payload: expose REST/GraphQL endpoints matching `docs/apis-required.txt`
- Configure webhooks to trigger Next.js revalidation on create/update/delete
- Store connection/config in `.env.local` (never commit secrets)

## Next steps
1) Confirm CMS product choice
2) Scaffold collections per `cms/screens-and-fields.md`
3) Map CMS endpoints to Next.js `app/api/*` handlers
4) Implement auth/permissions
5) Add webhooks for ISR revalidation
