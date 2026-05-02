// hooks/useQuestionHub.js
import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../Context/AuthContext";

export const useQuestionHub = (questionId) => {
  const queryClient = useQueryClient();
  const connectionRef = useRef(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!questionId || !accessToken) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://dactra.runasp.net/hubs/questions", {
        accessTokenFactory: () => accessToken,
        // خلي SignalR يبدأ بـ LongPolling مباشرة لأن runasp.net مش بيدعم WebSockets
        transport: signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .build();

    // helper لتعديل الـ cache
    const updateCache = (updater) => {
      queryClient.setQueryData(["comments-infinite", questionId], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => updater(page)),
        };
      });
    };

    connection.on("AnswerAdded", (newAnswer) => {
      // أضف الكومنت في أول page لو مش reply
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
        // لو reply → زود الـ repliesCount على الـ parent
        updateCache((page) => ({
          ...page,
          items: page.items.map((item) =>
            item.id === newAnswer.parentAnswerId
              ? { ...item, repliesCount: (item.repliesCount || 0) + 1 }
              : item,
          ),
        }));
      }
    });

    connection.on("InterestUpdated", () => {
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
    });

    connection.on("AnswerUpdated", (updatedAnswer) => {
      updateCache((page) => ({
        ...page,
        items: page.items.map((item) =>
          item.id === updatedAnswer.id ? { ...item, ...updatedAnswer } : item,
        ),
      }));
    });

    connection.on("AnswerDeleted", ({ answerId }) => {
      updateCache((page) => ({
        ...page,
        items: page.items.filter((item) => item.id !== answerId),
        totalCount: page.totalCount - 1,
      }));
    });

    connection.on(
      "AnswerLikeUpdated",
      ({ answerId, likesCount, isLikedByCurrentUser }) => {
        updateCache((page) => ({
          ...page,
          items: page.items.map((item) =>
            item.id === answerId
              ? { ...item, likesCount, isLikedByCurrentUser }
              : item,
          ),
        }));
      },
    );

    connection
      .start()
      .then(() => connection.invoke("JoinQuestionGroup", questionId))
      .catch(console.error);

    connectionRef.current = connection;

    return () => {
      connection.invoke("LeaveQuestionGroup", questionId).catch(() => {});
      connection.stop();
    };
  }, [questionId, queryClient]);
};
