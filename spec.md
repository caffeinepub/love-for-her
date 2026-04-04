# Love For Her

## Current State
- Romantic website with splash screen, hero (static bokeh bg), shayari section, quotes section, photo gallery section
- Admin panel at /admin with tabs: Shayari, Quotes, Photos
- Backend stores: shayari, love quotes, photo entries (as base64 dataUrl)
- Public photo upload enabled; admin can delete photos
- Admin password: "qazwsxplmokn123098"
- Navbar links: Home, Shayari, Quotes, Gallery, Admin

## Requested Changes (Diff)

### Add
- Backend: `HeroPhoto` type with a single "featured" photo (dataUrl, mimeType) that admin can set — stored as a single record, not a list
- Backend: `MusicTrack` type storing a single audio track (dataUrl, mimeType, title) that admin can set
- Backend: `setHeroPhoto(photo)` and `getHeroPhoto()` public functions
- Backend: `setMusicTrack(track)` (admin-only) and `getMusicTrack()` (public) functions
- Frontend: Hero section uses admin-uploaded hero photo as background (falling back to static bokeh if none uploaded)
- Frontend: Floating music player component (bottom-right sticky) that auto-plays the admin-uploaded track
- Frontend: Admin panel Music tab — upload an audio file (mp3/etc), store as dataUrl, with title field
- Frontend: Admin panel Hero Photo tab — upload a photo to use as the site hero background
- Frontend: Quotes section redesigned with 5 varied quote card styles (different fonts: Playfair, Dancing Script, Parisienne, InstrumentSerif, Fraunces — different card sizes, layouts)
- New romantic quotes (more varied, more poetic)

### Modify
- Navbar: remove "Shayari" link; add nothing (keep Home, Quotes, Gallery, Admin)
- HomePage: remove `<ShayariSection />`, keep hero, quotes, gallery, footer
- Admin tabs: remove Shayari tab, add Hero Photo tab and Music tab
- Hero section: fetch hero photo from backend and use as background if present
- Overall aesthetic: deeper rose/burgundy theme, Parisienne/Fraunces fonts for headers, more layered/textured feel

### Remove
- Shayari section from homepage
- Shayari tab from admin panel
- ShayariSection.tsx component (no longer rendered)

## Implementation Plan
1. Update `main.mo` to add HeroPhoto and MusicTrack types + CRUD functions
2. Regenerate backend.d.ts bindings
3. Update useQueries.ts hooks for new backend calls
4. Update HeroSection.tsx to fetch hero photo and use as bg
5. Rewrite QuotesSection.tsx with varied fonts/styles and new quotes
6. Update HomePage.tsx to remove ShayariSection
7. Update Navbar.tsx to remove Shayari nav link
8. Update AdminPage.tsx to remove Shayari tab, add Hero Photo tab and Music tab
9. Add MusicPlayer.tsx component to App or HomePage
10. Update index.css with Parisienne and Fraunces font imports, aesthetic tokens
