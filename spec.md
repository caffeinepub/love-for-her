# Love For Her

## Current State
The app has a romantic website with admin panel at /admin. Admin is authenticated via a local password ("qazwsxplmokn123098") stored in sessionStorage. Photos are stored as `Storage.ExternalBlob` which requires Internet Identity authentication at upload time -- causing upload failures because the local password system doesn't establish a real II identity that the backend recognizes as admin.

## Requested Changes (Diff)

### Add
- `dataUrl` field (Text) on PhotoEntry to store the base64 image data URL
- `getMimeType` / `getOrder` fields remain; ExternalBlob removed from PhotoEntry

### Modify
- `PhotoEntry` type in backend: replace `blob: Storage.ExternalBlob` with `dataUrl: Text` and `mimeType: Text`
- `addPhotoEntry` / `getAllPhotoEntries` / `deletePhotoEntry` remain but work with new type
- Frontend `AdminPage.tsx`: convert selected file to base64 data URL, pass dataUrl + mimeType instead of ExternalBlob
- Frontend `GallerySection.tsx`: render `<img src={photo.dataUrl}>` instead of `blob.getDirectURL()`
- Frontend `useQueries.ts`: update PhotoEntry usage to new type
- Frontend `backend.d.ts` / declarations: update PhotoEntry type

### Remove
- `blob-storage` component usage from PhotoEntry (ExternalBlob field removed from PhotoEntry type)
- `ExternalBlob.fromBytes` call in AdminPage upload handler
- `import { ExternalBlob } from "../backend"` in AdminPage (if no longer used)

## Implementation Plan
1. Rewrite `main.mo`: change `PhotoEntry` to use `dataUrl: Text` and `mimeType: Text` instead of `blob: Storage.ExternalBlob`
2. Regenerate / manually update `backend.d.ts` and declarations to reflect new PhotoEntry type
3. Update `AdminPage.tsx` upload handler to use `FileReader` to get base64 data URL
4. Update `GallerySection.tsx` to use `photo.dataUrl` as image src
5. Validate (typecheck + build) and deploy
