import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PhotoEntry {
    id: string;
    order: bigint;
    blob: ExternalBlob;
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
    getLoveQuoteById(id: string): Promise<LoveQuote | null>;
    getPhotoEntryById(id: string): Promise<PhotoEntry | null>;
    getShayariById(id: string): Promise<Shayari | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
