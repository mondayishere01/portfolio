# API Contracts

Base URL: `http://localhost:5000/api` (dev) | `VITE_API_URL` env var (prod)

All requests/responses are JSON. Admin routes require `Authorization: Bearer <jwt>`.
All responses include `_id`, `createdAt`, `updatedAt` (Mongoose timestamps) unless noted.

---

## Auth

### POST /api/auth/login

Request: `{ email: string, password: string }`
Response: `{ token: string, user: { id, name, email, role, imageUrl } }`
Token expires in 24h. Store in `localStorage` as `"token"`.

---

## About

### GET /api/about — Public

Response: `{ _id, name, title, bio, tagline, imageUrl, resumeUrl, socialLinks: [{ platform, url }] }`
Returns `{ bio: "", imageUrl: "" }` if no document exists yet.

### PUT /api/about — Admin

Request: `{ name?, title?, bio*, tagline?, imageUrl?, resumeUrl?, socialLinks?: [{ platform, url }] }`
`bio` is required. Upserts the single About document.

---

## Experiences

### GET /api/experiences — Public

Response: `Experience[]` sorted by `order` ascending.
Shape: `{ _id, date, title, company, companyUrl, imageUrl, description, tags: string[], order }`

### POST /api/experiences — Admin

Request: `{ date*, title*, company*, description*, companyUrl?, imageUrl?, tags?: string[], order?: number }`

### PUT /api/experiences/:id — Admin

Request: same fields as POST (all optional on update)

### DELETE /api/experiences/:id — Admin

Response: `{ message: "Experience deleted successfully" }`

---

## Projects

### GET /api/projects — Public

Query: `?featured=true` to filter featured only. Sorted by `year` desc, then `createdAt` desc.
Shape: `{ _id, title, description, imageUrl, link, githubUrl, tags: string[], featured, year }`

### POST /api/projects — Admin

Request: `{ title*, description*, imageUrl?, link?, githubUrl?, tags?: string[], featured?: boolean, year?: number }`

### PUT /api/projects/:id — Admin

### DELETE /api/projects/:id — Admin

---

## Skills

### GET /api/skills — Public

Response: `Skill[]`
Shape: `{ _id, name, category, proficiency: 1-5, imageUrl }`

### GET /api/skills/categories — Public

Response: `string[]` — list of valid category names from `Skill.SKILL_CATEGORIES`

### POST /api/skills — Admin

Request: `{ name*, category*, proficiency?: number (1-5), imageUrl?: string }`

### PUT /api/skills/:id — Admin

### DELETE /api/skills/:id — Admin

---

## Certifications

### GET /api/certifications — Public

Response: `Certification[]` sorted by `order` ascending.
Shape: `{ _id, title, credentialUrl, order }`

### POST /api/certifications — Admin

Request: `{ title*, credentialUrl?: string, order?: number }`

### PUT /api/certifications/:id — Admin

### DELETE /api/certifications/:id — Admin

---

## Blogs

### GET /api/blogs — Public

Query: `?category=string`, `?tag=string`
Response: `Blog[]` sorted by `createdAt` desc, author populated as `{ name, imageUrl, bio }`.
Shape: `{ _id, title, content, imageUrl, category, tags: string[], author: { _id, name, imageUrl, bio }, createdAt }`

### GET /api/blogs/:id — Public

Response: blog object with author populated as `{ name, imageUrl, bio, socialLinks }` plus:
`prev: { _id, title } | null`, `next: { _id, title } | null`

### POST /api/blogs — Auth (author or admin)

Request: `{ title*, content*, category*, imageUrl?: string, tags?: string[] }`
Triggers newsletter broadcast to active subscribers via `setImmediate` (non-blocking).

### PUT /api/blogs/:id — Auth (own author or admin)

### DELETE /api/blogs/:id — Auth (own author or admin)

---

## Contact

### POST /api/contact — Public

Request: `{ name*, email*, message* }`
Response: `{ message: "Message sent successfully", id: string }`
Triggers email notification to `settings.notifyEmail` (fire-and-forget).

### GET /api/contact/messages — Admin

Response: `ContactMessage[]` sorted by `createdAt` desc.
Shape: `{ _id, name, email, message, status, createdAt }`

### DELETE /api/contact/messages/:id — Admin

---

## Settings

### GET /api/settings — Public

Response: `{ _id, notifyEmail, blogTitle, blogSubtitle, footerText, copyrightText }`
Auto-creates with defaults if none exists.

### PUT /api/settings — Admin

Request: `{ notifyEmail?, blogTitle?, blogSubtitle?, footerText?, copyrightText? }` (all optional)

---

## Users

### GET /api/users — Admin

Response: `User[]` without `passwordHash`, sorted by `createdAt` desc.
Shape: `{ _id, name, email, role, imageUrl, bio, socialLinks }`

### POST /api/users — Admin

Request: `{ name*, email*, password*, role?: "admin" | "author" }`
Response: `{ id, name, email, role }`

### DELETE /api/users/:id — Admin

Cannot delete own account.

### GET /api/users/me — Auth

Response: current user object (no `passwordHash`)

### PUT /api/users/me — Auth

Request: `{ name?, email?, bio?, imageUrl?, socialLinks?, password? }`

---

## Dashboard

### GET /api/dashboard — Admin

Response: `{ blogs: number, messages: number, projects: number, experiences: number }`
`messages` = count of unread ContactMessages.

---

## Upload

### POST /api/upload?folder=<name> — Admin

Content-Type: `multipart/form-data`, field name: `file`
Response: `{ url: string, public_id: string }` (Cloudinary)

### DELETE /api/resources/delete?public_id=<id> — Admin

---

## Newsletter

### POST /api/newsletter/subscribe — Public

Request: `{ email* }`
Response: `{ message: "Subscribed successfully" }` or re-activates if previously unsubscribed.

### POST /api/newsletter/unsubscribe — Public

Request: `{ email* }`
