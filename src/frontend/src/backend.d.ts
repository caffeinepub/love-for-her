import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PhotoEntry {
    id: string;
    order: bigint;
    dataUrl: string;
    mimeType: string;
    caption: string;
}
export interface LoveQuote {
    id: string;
    text: string;
    author?: string;
}
export interface UserProfile {
    name: string;
}
export interface Shayari {
    id: string;
    title: string;
    order: bigint;
    body: string;
}
export interface HeroPhoto {
    dataUrl: string;
    mimeType: string;
}
export interface MusicTrack {
    dataUrl: string;
    mimeType: string;
    title: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addLoveQuote(newQuote: LoveQuote): Promise<void>;
    addPhotoEntry(newPhoto: PhotoEntry): Promise<void>;
    addShayari(newShayari: Shayari): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearHeroPhoto(): Promise<void>;
    clearMusicTrack(): Promise<void>;
    deleteLoveQuote(id: string): Promise<void>;
    deletePhotoEntry(id: string): Promise<void>;
    deleteShayari(id: string): Promise<void>;
    editLoveQuote(updatedQuote: LoveQuote): Promise<void>;
    editPhotoEntry(updatedPhoto: PhotoEntry): Promise<void>;
    editShayari(updatedShayari: Shayari): Promise<void>;
    getAllLoveQuotes(): Promise<Array<LoveQuote>>;
    getAllPhotoEntries(): Promise<Array<PhotoEntry>>;
    getAllShayari(): Promise<Array<Shayari>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHeroPhoto(): Promise<HeroPhoto | null>;
    getLoveQuoteById(id: string): Promise<LoveQuote | null>;
    getMusicTrack(): Promise<MusicTrack | null>;
    getPhotoEntryById(id: string): Promise<PhotoEntry | null>;
    getShayariById(id: string): Promise<Shayari | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setHeroPhoto(photo: HeroPhoto): Promise<void>;
    setMusicTrack(track: MusicTrack): Promise<void>;
}
