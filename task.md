# Portfolio Project Tasks

## Phase 1 (Complete ✅)
- [x] Phase 0–Day 4: Backend, Frontend, Admin Panel, Deploy

---

## Phase 2 — Feature Enhancements (Complete ✅)

### Sprint 1 — Site Meta + Skills + Certifications ✅
- [x] Fix favicon (teal "D" SVG) & title (`Devesh | Full Stack Developer`)
- [x] Skill model + routes (name, category enum, proficiency 1-5, imageUrl)
- [x] Certification model + routes (title, credentialUrl only)
- [x] Add new endpoints to `api/index.js`
- [x] Skills section in `Home.jsx` (grouped by category, proficiency dots, thumbnails)
- [x] Certifications section in `Home.jsx` (compact list with links)
- [x] Update `Layout.jsx` nav + scroll-spy
- [x] `ManageSkills.jsx` admin page (category dropdown, proficiency selector, imageUrl)
- [x] `ManageCertifications.jsx` admin page (title + URL)
- [x] Update Dashboard nav + App.jsx routes
- [x] Build verification

### Sprint 2 — Social Links (in About) + Resume + Card Enhancements ✅
- [x] Add `resumeUrl` + `socialLinks[]` to About model
- [x] Add `githubUrl` to Project model
- [x] Add `imageUrl` to Experience model
- [x] `SocialIcons.jsx` fetches from About API (dynamic)
- [x] Resume download button in `Layout.jsx`
- [x] `ProjectCard.jsx` GitHub link icon
- [x] `ExperienceCard.jsx` company logo display
- [x] Update `ManageAbout.jsx` (resumeUrl + social links editor)
- [x] Update `ManageProjects.jsx` (githubUrl field)
- [x] Update `ManageExperiences.jsx` (imageUrl field)
- [x] Build verification

### Sprint 3 — Contact Email Notifications ✅
- [x] Install Nodemailer on server
- [x] Create `emailService.js` utility
- [x] Update `contactController.js` to send email
- [x] Settings model + routes (notifyEmail)
- [x] `ManageSettings.jsx` admin page
- [x] Build verification

---

## Phase 3 — Cloudinary Image Uploads 
- [x] Install `cloudinary`, `multer`, `multer-storage-cloudinary` on server
- [x] Add Cloudinary config utility using env vars
- [x] Create generic `/api/upload` route for admin
- [x] Update `ManageSkills.jsx` to use file uploader
- [x] Update `ManageProjects.jsx` to use file uploader
- [x] Update `ManageExperiences.jsx` to use file uploader
- [x] Update `ManageAbout.jsx` to support PDF resume uploads
- [x] Build & Verify

