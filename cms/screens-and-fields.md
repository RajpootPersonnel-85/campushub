# CMS Screens and Fields

This document defines the content models (collections), fields, relations, validations, and suggested CMS screens. It maps to the API plan in `docs/apis-required.txt` and pages in `app/`.

Conventions
- Field format: `fieldName (Type) [required?]` – notes/validation
- Relations specify target collection and cardinality
- Common system fields (managed by CMS): `id`, `createdAt`, `updatedAt`, `status (draft|published|archived)`, `slug` where relevant

## Navigation (CMS Sidebar)
- Dashboard
- Content
  - Books, Book Reviews
  - Notes, Note Comments
  - Jobs
  - Hostels
  - Deals
  - Exams
  - Resources
  - Schemes
  - Community Posts, Community Tags
  - Careers Roles
  - Tiffin Vendors, Tiffin Plans, Tiffin Orders
  - Wellbeing Resources, Counseling Slots, Counseling Appointments, Chat Messages
  - Site Settings, Home Highlights
- Users & Roles
- Leads (Support)

---

## Users
- name (Text) [required]
- email (Email) [required; unique]
- password (Password) [required] – hashed by CMS
- avatar (Image)
- phone (Text)
- role (Enum: admin|editor|author|support|vendor|student) [required]
- preferences (JSON)

Permissions
- Admin full; Editor read/write except Users; Author read self; Support read Leads; Vendor read self vendor records

## Sellers (optional if separate from Users)
- user (Relation -> Users 1:1) [required]
- displayName (Text)
- rating (Number; 0..5)
- totalSales (Number)
- location (Text)
- verified (Boolean)
- responseTimeHint (Text)

## Books
- title (Text) [required]
- author (Text) [required]
- price (Number) [required; min 0]
- originalPrice (Number)
- condition (Enum: Excellent|Good|Fair) [required]
- subject (Text) [required]
- description (Rich Text/Markdown)
- images (Media Gallery) – multiple
- postedDate (DateTime) [default now]
- isbn (Text)
- edition (Text)
- language (Text)
- publisher (Text)
- pages (Number)
- weight (Text)
- specifications (Key-Value JSON)
- tags (Tags/String array)
- seller (Relation -> Users or Sellers) [required]
- location (Text)
- status (Enum: draft|published|archived) [required]

Indexes
- text index on title, author, subject, tags

## Book Reviews
- book (Relation -> Books) [required]
- buyer (Relation -> Users) [required]
- rating (Number 1..5) [required]
- comment (Text/Rich Text)
- verified (Boolean)
- date (Date) [default now]

## Notes
- title (Text) [required]
- subject (Text) [required]
- description (Rich Text)
- file (File: pdf/image(s)) [required]
- previewImages (Media Gallery)
- uploader (Relation -> Users) [required]
- tags (Tags/String array)
- likes (Number) [default 0]
- views (Number) [default 0]
- status (Enum: draft|published|archived) [required]

## Note Comments
- note (Relation -> Notes) [required]
- user (Relation -> Users) [required]
- text (Text) [required]
- createdAt (DateTime) [default now]

## Jobs
- title (Text) [required]
- company (Text) [required]
- location (Text)
- type (Enum: Full-time|Internship|Part-time|Contract)
- stipend (Number)
- salary (Number)
- postedAt (Date) [default now]
- applyUrl (URL)
- description (Rich Text)
- tags (Tags)
- status (Enum: draft|published|archived)

## Hostels
- name (Text) [required]
- location (Text) [required]
- description (Rich Text)
- images (Media Gallery)
- priceFrom (Number) [required]
- amenities (String array)
- rating (Number 0..5)
- rooms (Repeater)
  - type (Text)
  - price (Number)
  - availability (Boolean)
- rules (String array)
- contactPhone (Text)
- contactEmail (Email)
- thumbnail (Image)
- status (Enum)

## Deals
- title (Text) [required]
- image (Image)
- price (Number)
- discountPercent (Number 0..100)
- validTill (Date)
- url (URL)
- description (Rich Text)
- status (Enum)

## Exams
- name (Text) [required]
- slug (Slug) [required; unique]
- date (Date)
- level (Enum: National|State|University|Other)
- category (Text)
- registrationOpen (Boolean)
- brochure (File/URL)
- schedule (Rich Text/JSON)
- syllabus (String array or Rich Text sections)
- eligibility (Rich Text)
- applicationLinks (Repeater)
  - label (Text)
  - url (URL)
- faqs (Repeater)
  - question (Text)
  - answer (Rich Text)
- status (Enum)

## Resources
- title (Text) [required]
- category (Text) [required]
- url (URL) [required]
- description (Text)
- icon (Image or Icon name)
- status (Enum)

## Schemes
- title (Text) [required]
- summary (Text/Rich Text)
- eligibility (Rich Text)
- applyUrl (URL)
- tags (Tags)
- status (Enum)

## Community Posts
- title (Text) [required]
- slug (Slug) [unique]
- content (Rich Text/Portable Text) [required]
- author (Relation -> Users) [required]
- tags (Relation -> Community Tags many)
- createdAt (DateTime) [default now]
- upvotes (Number) [default 0]
- status (Enum)

## Community Tags
- name (Text) [required; unique]
- description (Text)

## Careers Roles
- title (Text) [required]
- category (Text)
- medianSalary (Number)
- growth (Number or Enum: Low|Medium|High)
- skills (String array)
- pros (String array)
- cons (String array)
- description (Rich Text)

## Tiffin Vendors
- name (Text) [required]
- cuisine (Text)
- veg (Boolean)
- phone (Text)
- address (Text)
- images (Media Gallery)
- deliveryAreas (String array)
- owner (Relation -> Users) [required]
- status (Enum)

## Tiffin Plans
- vendor (Relation -> Tiffin Vendors) [required]
- name (Text) [required]
- price (Number) [required]
- mealsPerDay (Number)
- description (Text)
- active (Boolean) [default true]

## Tiffin Orders
- user (Relation -> Users) [required]
- vendor (Relation -> Tiffin Vendors) [required]
- plan (Relation -> Tiffin Plans) [required]
- status (Enum: pending|paid|active|cancelled|refunded) [required]
- amount (Number) [required]
- placedAt (DateTime) [default now]
- startDate (Date)
- address (Text/JSON)
- paymentRef (Text)

## Wellbeing Resources
- title (Text) [required]
- type (Enum: article|video|workshop)
- url (URL)
- tags (Tags)
- status (Enum)

## Counseling Slots
- start (DateTime) [required]
- end (DateTime) [required]
- counselor (Relation -> Users) [required]
- capacity (Number) [default 1]
- active (Boolean)

## Counseling Appointments
- slot (Relation -> Counseling Slots) [required]
- user (Relation -> Users) [required]
- mode (Enum: online|offline) [required]
- notes (Text)
- status (Enum: pending|confirmed|completed|cancelled)
- bookingId (Text) [unique]

## Chat Messages
- sender (Enum: user|counselor) [required]
- user (Relation -> Users) [required]
- text (Text)
- attachments (Media Gallery)
- createdAt (DateTime)
- conversationId (Text)

## Site Settings
- siteName (Text)
- logo (Image)
- primaryColor (Text)
- contactEmail (Email)
- socialLinks (Key-Value JSON)

## Home Highlights
- type (Enum: book|job|note|hostel|deal|custom) [required]
- title (Text) [required]
- url (URL) [required]
- image (Image)
- order (Number)
- active (Boolean)

## Leads (Support)
- name (Text) [required]
- email (Email) [required]
- phone (Text)
- topic (Text) [required]
- subject (Text) [required]
- message (Rich Text) [required]
- priority (Enum: low|normal|high) [default normal]
- department (Text)
- prefEmail (Boolean)
- prefWhatsapp (Boolean)
- attachment (File)
- receivedAt (DateTime)
- userAgent (Text)
- referer (Text)

---

# Screen Layout Suggestions
- List views: filters by status/date/search; columns per collection key fields
- Create/Edit views: group fields into sections (Basics, Pricing, Media, Relations)
- Access control: field-level guards (e.g., `seller` locked to current vendor)
- Publishing workflow: status toggle with validations on required fields when publishing

# Validation & Hooks (examples)
- Books: `price >= 0`; require at least one image when publishing
- Notes: require file; restrict file types to pdf/images
- Exams: unique `slug`; date >= today optional check
- Tiffin Plans: `price > 0`
- Appointments: prevent overlap by slot capacity

# Webhooks
- On publish/update/delete -> call Next.js revalidate for affected routes

# Mappings to APIs
- Each collection corresponds to `/api/<collection>` list/detail endpoints as defined in `docs/apis-required.txt`.
