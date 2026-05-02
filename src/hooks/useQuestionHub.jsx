// hooks/useQuestionHub.js
import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../Context/AuthContext";

export const useQuestionHub = (questionId) => {
  const queryClient = useQueryClient();
  const connectionRef = useRef(null);
  const { accessToken } = useAuth();

  questionId = Number(questionId);
  console.log(questionId);

  useEffect(() => {
    if (!questionId || !accessToken) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://dactra.runasp.net/hubs/questions", {
        accessTokenFactory: () => accessToken,
        transport: signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .build();

    // ✅ helper محسّن - بيعمل deep spread صح
    const updateAnswerInCache = (updater) => {
      queryClient.setQueryData(["comments-infinite", questionId], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map(updater),
          })),
        };
      });
    };

    connection.on("AnswerAdded", (newAnswer) => {
      if (!newAnswer.parentAnswerId) {
        queryClient.setQueryData(["comments-infinite", questionId], (old) => {
          if (!old) return old;
          const firstPage = old.pages[0];
          return {
            ...old,
            pages: [
              {
                ...firstPage,
                items: [newAnswer, ...firstPage.items],
                totalCount: firstPage.totalCount + 1,
              },
              ...old.pages.slice(1),
            ],
          };
        });
      } else {
        updateAnswerInCache((item) =>
          item.id === newAnswer.parentAnswerId
            ? { ...item, repliesCount: (item.repliesCount || 0) + 1 }
            : item,
        );
      }
    });

    // حط ده جوه الـ handler
    connection.on("AnswerLikeUpdated", (data) => {
      const answerId = data.answerId ?? data.AnswerId;
      const likesCount = data.likesCount ?? data.LikesCount;
      const isLikedByCurrentUser =
        data.isLikedByCurrentUser ?? data.IsLikedByCurrentUser;

      updateAnswerInCache((item) =>
        item.id === answerId
          ? { ...item, likesCount, isLikedByCurrentUser }
          : item,
      );
    });

    connection.on("InterestUpdated", () => {
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
    });

    // ✅ AnswerUpdated محسّن
    connection.on("AnswerUpdated", (updatedAnswer) => {
      updateAnswerInCache((item) =>
        item.id === updatedAnswer.id ? { ...item, ...updatedAnswer } : item,
      );
    });

    connection.on("AnswerDeleted", ({ answerId }) => {
      queryClient.setQueryData(["comments-infinite", questionId], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.filter((item) => item.id !== answerId),
            totalCount: page.totalCount - 1,
          })),
        };
      });
    });

    connection
      .start()
      .then(() => connection.invoke("JoinQuestionGroup", questionId))
      .catch(console.error);

    connectionRef.current = connection;

    return () => {
      connection.invoke("LeaveQuestionGroup", questionId).catch(() => {});
      connection.stop();
    };
  }, [questionId, accessToken, queryClient]); // ✅ أضف accessToken للـ deps
};
