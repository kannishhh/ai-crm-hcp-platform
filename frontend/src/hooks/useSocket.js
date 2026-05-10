import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import socketService from "../services/socket";
import { addNotification } from "../store/slices/notificationSlice";
import {
  fetchInteractions,
  fetchAnalytics,
} from "../store/slices/interactionSlice";
import { setAiProcessing } from "../store/slices/aiSlice";
import toast from "react-hot-toast";

export const useSocket = () => {
  const dispatch = useDispatch();
  const processedIds = useRef(new Set());

  useEffect(() => {
    const socket = socketService.connect();

    socket.on("new_notification", (data) => {
      if (data.id && processedIds.current.has(data.id)) return;
      if (data.id) processedIds.current.add(data.id);

      dispatch(addNotification(data));

      if (data.type === "compliance") {
        toast.error(data.message, { duration: 5000, position: "top-right" });
      } else {
        toast.success(data.message, { position: "top-right" });
      }
    });

    socket.on("refresh_dashboard", () => {
      dispatch(fetchAnalytics());
      dispatch(fetchInteractions());
    });

    socket.on("refresh_feed", () => {
      dispatch(fetchInteractions());
    });

    socket.on("ai_status", (data) => {
      dispatch(setAiProcessing(data.status === "processing"));
    });

    socket.on("interaction_updated", (data) => {
      dispatch(fetchInteractions());
      dispatch(fetchAnalytics());
      toast.success(
        `Interaction updated: ${data.updates ? Object.keys(data.updates)[0] : ""}`,
        {
          icon: "📝",
          position: "bottom-right",
        },
      );
    });

    socket.on("new_interaction_saved", () => {
      dispatch(fetchInteractions());
      dispatch(fetchAnalytics());
    });

    socket.on("compliance_risk_detected", (data) => {
      toast.error(`Compliance Risk: ${data.risk || "High"}`, {
        icon: "⚠️",
        duration: 6000,
      });
    });

    socket.on("analytics_updated", () => {
      dispatch(fetchAnalytics());
    });

    socket.on("followup_generated", () => {
      toast.success("New follow-up suggestions ready", { icon: "📅" });
    });

    return () => {
      socket.off("new_notification");
      socket.off("refresh_dashboard");
      socket.off("refresh_feed");
      socket.off("ai_status");
      socket.off("interaction_updated");
      socket.off("new_interaction_saved");
      socket.off("compliance_risk_detected");
      socket.off("analytics_updated");
      socket.off("followup_generated");
    };
  }, [dispatch]);
};
