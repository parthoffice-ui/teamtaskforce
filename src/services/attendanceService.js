/**
 * Attendance Service — pure business logic for attendance operations.
 */

import { uid, todayStr, nowTime, calcDuration } from '../utils/dateUtils.js';

/**
 * Build a new check-in record
 */
export const buildCheckIn = (userId) => ({
  id: uid(),
  userId,
  date: todayStr(),
  checkIn: nowTime(),
  checkOut: null,
  duration: null,
});

/**
 * Apply check-out to an existing attendance record
 */
export const applyCheckOut = (record) => {
  const checkOut = nowTime();
  return {
    ...record,
    checkOut,
    duration: calcDuration(record.checkIn, checkOut),
  };
};
