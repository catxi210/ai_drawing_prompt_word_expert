import { createScopedLogger } from "@/utils/logger";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/db";
import { History } from "@/db/types";
import { useCallback } from "react";
import { AddHistory } from "@/db/types";

const logger = createScopedLogger("use-gen-style-history");
const PAGE_SIZE = 99999;

export const useStyleHistory = (page = 1) => {
  const offset = (page - 1) * PAGE_SIZE;

  const genHistory = useLiveQuery(async () => {
    const genHistory = await db.styleHistory
      .orderBy("createdAt")
      .reverse()
      .offset(offset)
      .limit(PAGE_SIZE)
      .toArray();
    return genHistory;
  }, [page]);

  const history = useLiveQuery(async () => {
    const [items, total] = await Promise.all([
      db.styleHistory
        .orderBy("createdAt")
        .reverse()
        .offset(offset)
        .limit(PAGE_SIZE)
        .toArray(),
      db.styleHistory.count(),
    ]);

    return {
      items,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
      currentPage: page,
    };
  }, [page]);

  const addHistory = useCallback(async (history: AddHistory) => {
    const id = crypto.randomUUID();
    await db.styleHistory.add({
      ...history,
      id,
      createdAt: Date.now(),
    });
    return id;
  }, []);

  const updateHistory = useCallback((id: string, history: Partial<History>) => {
    db.styleHistory.update(id, history);
  }, []);

  const deleteHistory = useCallback((id: string) => {
    db.styleHistory.delete(id);
  }, []);

  const updateHistoryImage = useCallback(
    async (
      historyId: string,
      index: number,
      image: {
        base64: string;
        prompt: string;
        model?: string;
        status: "success" | "failed";
      }
    ) => {
      await db.styleHistory
        .where("id")
        .equals(historyId)
        .modify((history: History) => {
          history.image = image as History["image"];
        });
    },
    []
  );

  const updateHistoryImageStatus = useCallback(
    async (
      historyId: string,
      index: number,
      status: "pending" | "success" | "failed"
    ) => {
      await db.styleHistory
        .where("id")
        .equals(historyId)
        .modify((history: History) => {
          history.image.status = status;
        });
    },
    []
  );

  return {
    genHistory,
    history,
    addHistory,
    updateHistory,
    deleteHistory,
    updateHistoryImage,
    updateHistoryImageStatus,
  };
};
