/* ============================================================
 * Activity Form Hook
 * Form management for activity (task/meeting/call) creation/editing
 * ============================================================ */

import { useCallback, useMemo } from "react";
import { useFormBase } from "./useFormBase";
import { activityFormSchema, type ActivityFormData } from "@/schemas/validation";
import type { Activity } from "@/types/crm";
import type { FormMode } from "@/types/forms";
import { transformToApiFormat } from "@/utils/formUtils";
import { addHours, addDays, format } from "date-fns";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseActivityFormOptions {
  mode: FormMode;
  activity?: Activity;
  contactId?: string;
  dealId?: string;
  leadId?: string;
  onSuccess?: (activity: Activity) => void;
  onCancel?: () => void;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export type UseActivityFormReturn = ReturnType<typeof useActivityForm>;

/* ============================================================
 * Mock API Functions (replace with real API later)
 * ============================================================ */

async function mockCreateActivity(data: unknown): Promise<Activity> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...(data as Omit<Activity, "id">),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Activity;
}

async function mockUpdateActivity(
  id: string,
  data: unknown
): Promise<Activity> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id,
    ...(data as Omit<Activity, "id">),
    updatedAt: new Date().toISOString(),
  } as Activity;
}

/* ============================================================
 * Activity Form Hook
 * ============================================================ */

export function useActivityForm({
  mode,
  activity,
  contactId,
  dealId,
  leadId,
  onSuccess,
  onCancel,
}: UseActivityFormOptions) {
  /* ============================================================
   * Default Values
   * ============================================================ */

  const defaultValues = useMemo<Partial<ActivityFormData>>(() => {
    if (mode === "edit" && activity) {
      return {
        type: activity.type,
        title: activity.title,
        dueDate: activity.dueDate,
        description: activity.description || "",
        priority: activity.priority,
        status: activity.status,
        contactId: activity.contactId || "",
        dealId: activity.dealId || "",
        leadId: activity.leadId || "",
        assigneeId: activity.assigneeId || "",
        startTime: activity.startTime || "",
        endTime: activity.endTime || "",
        location: activity.location || "",
        participants: activity.participants || [],
        completedDate: activity.completedDate || "",
        outcome: activity.outcome || "",
        reminderMinutes: activity.reminderMinutes,
        tags: activity.tags || [],
      };
    }

    // Default for new activities
    const defaultDueDate = addDays(new Date(), 1);

    return {
      type: "task",
      title: "",
      dueDate: defaultDueDate.toISOString(),
      priority: "medium",
      status: "pending",
      contactId: contactId || "",
      dealId: dealId || "",
      leadId: leadId || "",
      participants: [],
      tags: [],
      reminderMinutes: 60, // 1 hour before
    };
  }, [mode, activity, contactId, dealId, leadId]);

  /* ============================================================
   * Submit Handler
   * ============================================================ */

  const handleSubmit = useCallback(
    async (data: ActivityFormData) => {
      const apiData = transformToApiFormat(data);

      if (mode === "create") {
        const newActivity = await mockCreateActivity(apiData);
        onSuccess?.(newActivity);
      } else if (mode === "edit" && activity) {
        const updatedActivity = await mockUpdateActivity(activity.id, apiData);
        onSuccess?.(updatedActivity);
      }
    },
    [mode, activity, onSuccess]
  );

  /* ============================================================
   * Form Instance
   * ============================================================ */

  const formBase = useFormBase<ActivityFormData>({
    schema: activityFormSchema,
    config: {
      mode,
      defaultValues,
      onSubmit: handleSubmit,
      onCancel,
      resetOnSuccess: mode === "create",
      validateOnChange: false,
      validateOnBlur: true,
    },
  });

  /* ============================================================
   * Helper Methods
   * ============================================================ */

  /** Set default time slots based on activity type */
  const setDefaultTimeSlots = useCallback(
    (type: ActivityFormData["type"]) => {
      const now = new Date();
      let startTime: Date;
      let endTime: Date;

      if (type === "meeting") {
        // Default 1-hour meeting starting next hour
        startTime = addHours(now, 1);
        startTime.setMinutes(0, 0, 0);
        endTime = addHours(startTime, 1);
      } else if (type === "call") {
        // Default 30-minute call starting next hour
        startTime = addHours(now, 1);
        startTime.setMinutes(0, 0, 0);
        endTime = addHours(startTime, 0.5);
      } else {
        return;
      }

      formBase.setFieldValue("startTime", format(startTime, "HH:mm"));
      formBase.setFieldValue("endTime", format(endTime, "HH:mm"));
    },
    [formBase]
  );

  /** Mark activity as completed */
  const markAsCompleted = useCallback(
    (outcome?: string) => {
      formBase.setFieldValue("status", "completed");
      formBase.setFieldValue("completedDate", new Date().toISOString());
      if (outcome) {
        formBase.setFieldValue("outcome", outcome);
      }
    },
    [formBase]
  );

  /** Cancel activity */
  const cancelActivity = useCallback(() => {
    formBase.setFieldValue("status", "cancelled");
  }, [formBase]);

  /** Calculate duration in minutes */
  const getDurationMinutes = useCallback(() => {
    const { startTime, endTime } = formBase.form.getValues();
    if (!startTime || !endTime) return 0;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    return endTotalMinutes - startTotalMinutes;
  }, [formBase.form]);

  /** Format duration as readable string */
  const getFormattedDuration = useCallback(() => {
    const minutes = getDurationMinutes();
    if (minutes <= 0) return "0 minutes";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  }, [getDurationMinutes]);

  /** Check if activity is overdue */
  const isOverdue = useCallback(() => {
    const { dueDate, status } = formBase.form.getValues();
    if (!dueDate || status === "completed" || status === "cancelled") {
      return false;
    }

    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  }, [formBase.form]);

  /** Get days until due */
  const getDaysUntilDue = useCallback(() => {
    const dueDate = formBase.getFieldValue("dueDate");
    if (!dueDate) return null;

    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }, [formBase]);

  /** Get reminder time */
  const getReminderTime = useCallback(() => {
    const { dueDate, reminderMinutes } = formBase.form.getValues();
    if (!dueDate || !reminderMinutes) return null;

    const due = new Date(dueDate);
    const reminder = new Date(due.getTime() - reminderMinutes * 60000);

    return reminder;
  }, [formBase.form]);

  /** Add participant */
  const addParticipant = useCallback(
    (participantEmail: string) => {
      const current = formBase.getFieldValue("participants") || [];
      if (!current.includes(participantEmail)) {
        formBase.setFieldValue("participants", [...current, participantEmail]);
      }
    },
    [formBase]
  );

  /** Remove participant */
  const removeParticipant = useCallback(
    (participantEmail: string) => {
      const current = formBase.getFieldValue("participants") || [];
      formBase.setFieldValue(
        "participants",
        current.filter((p) => p !== participantEmail)
      );
    },
    [formBase]
  );

  /** Validate time range */
  const validateTimeRange = useCallback(() => {
    const duration = getDurationMinutes();

    if (duration <= 0) {
      return "End time must be after start time";
    }

    if (duration > 480) {
      // 8 hours
      return "Duration cannot exceed 8 hours";
    }

    return true;
  }, [getDurationMinutes]);

  /** Get priority color */
  const getPriorityColor = useCallback(() => {
    const priority = formBase.getFieldValue("priority");

    const colors = {
      low: "gray",
      medium: "blue",
      high: "orange",
      urgent: "red",
    };

    return colors[priority] || "gray";
  }, [formBase]);

  /** Get status color */
  const getStatusColor = useCallback(() => {
    const status = formBase.getFieldValue("status");

    const colors = {
      pending: "yellow",
      in_progress: "blue",
      completed: "green",
      cancelled: "gray",
    };

    return colors[status] || "gray";
  }, [formBase]);

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    ...formBase,
    mode,
    activity,
    isLoading: formBase.isSubmitting,
    helpers: {
      setDefaultTimeSlots,
      markAsCompleted,
      cancelActivity,
      getDurationMinutes,
      getFormattedDuration,
      isOverdue,
      getDaysUntilDue,
      getReminderTime,
      addParticipant,
      removeParticipant,
      validateTimeRange,
      getPriorityColor,
      getStatusColor,
    },
  };
}
