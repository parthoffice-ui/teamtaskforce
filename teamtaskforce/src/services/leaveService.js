/**
 * Leave Service — pure business logic for leave operations.
 */

import { uid, todayStr, calcDays } from '../utils/dateUtils.js';

/**
 * Build a new leave application
 */
export const buildLeave = ({ userId, fromDate, toDate, reason }) => ({
  id: uid(),
  userId,
  fromDate,
  toDate,
  days: calcDays(fromDate, toDate),
  reason: reason.trim(),
  status: 'Pending',
  appliedAt: todayStr(),
  respondedBy: null,
  respondedAt: null,
});

/**
 * Apply an admin response (Approved / Rejected) to a leave
 */
export const applyLeaveResponse = (leave, status, responderId) => ({
  ...leave,
  status,
  respondedBy: responderId,
  respondedAt: todayStr(),
});
