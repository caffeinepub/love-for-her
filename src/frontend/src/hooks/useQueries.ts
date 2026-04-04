import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoveQuote, PhotoEntry, Shayari } from "../backend";
import { useActor } from "./useActor";

export function useGetAllShayari() {
  const { actor, isFetching } = useActor();
  return useQuery<Shayari[]>({
    queryKey: ["shayari"],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getAllShayari();
      return [...items].sort((a, b) => Number(a.order) - Number(b.order));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllLoveQuotes() {
  const { actor, isFetching } = useActor();
  return useQuery<LoveQuote[]>({
    queryKey: ["quotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLoveQuotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllPhotoEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<PhotoEntry[]>({
    queryKey: ["photos"],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getAllPhotoEntries();
      return [...items].sort((a, b) => Number(a.order) - Number(b.order));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useAddShayari() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: Shayari) => {
      if (!actor) throw new Error("Not connected");
      await actor.addShayari(s);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shayari"] }),
  });
}

export function useEditShayari() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: Shayari) => {
      if (!actor) throw new Error("Not connected");
      await actor.editShayari(s);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shayari"] }),
  });
}

export function useDeleteShayari() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteShayari(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shayari"] }),
  });
}

export function useAddLoveQuote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (q: LoveQuote) => {
      if (!actor) throw new Error("Not connected");
      await actor.addLoveQuote(q);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quotes"] }),
  });
}

export function useEditLoveQuote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (q: LoveQuote) => {
      if (!actor) throw new Error("Not connected");
      await actor.editLoveQuote(q);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quotes"] }),
  });
}

export function useDeleteLoveQuote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteLoveQuote(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quotes"] }),
  });
}

export function useAddPhotoEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: PhotoEntry) => {
      if (!actor) throw new Error("Not connected");
      await actor.addPhotoEntry(p);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["photos"] }),
  });
}

export function useDeletePhotoEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deletePhotoEntry(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["photos"] }),
  });
}
