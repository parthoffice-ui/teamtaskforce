/**
 * Task Service — pure business logic functions for task operations.
 * No side effects, no state. Easy to unit test.
 */

import { uid, todayStr, nowFull } from '../utils/dateUtils.js';

/**
 * Build a new task object
 */
export const buildTask = ({ title, description, assignedTo, assignedBy, priority, deadline, creatorName }) => ({
  id: uid(),
  title: title.trim(),
  description: description || '',
  assignedTo,
  assignedBy,
  status: 'Pending',
  priority: priority || 'Medium',
  deadline: deadline || '',
  createdAt: todayStr(),
  updatedAt: todayStr(),
  comments: [],
  history: [{ action: `Task created by ${creatorName}`, by: creatorName, at: nowFull() }],
});

/**
 * Apply an edit to an existing task
 */
export const applyTaskEdit = (task, changes, editorName) => ({
  ...task,
  ...changes,
  updatedAt: todayStr(),
  history: [...task.history, { action: `Edited by ${editorName}`, by: editorName, at: nowFull() }],
});

/**
 * Apply a status update + optional comment to a task
 */
export const applyTaskUpdate = (task, { status, comment, reason }, updaterName) => {
  const newHistory = [...task.history];
  const newComments = [...task.comments];

  if (status !== task.status) {
    newHistory.push({ action: `Status → ${status}`, by: updaterName, at: nowFull() });
  }

  if (comment?.trim()) {
    newComments.push({
      id: uid(),
      text: comment.trim(),
      reason: reason || '',
      byId: null, // filled in by hook
      byName: updaterName,
      at: nowFull(),
    });
    newHistory.push({ action: 'Comment added', by: updaterName, at: nowFull() });
  }

  return { ...task, status, comments: newComments, history: newHistory, updatedAt: todayStr() };
};

/**
 * Filter tasks by given criteria
 */
export const filterTasks = (tasks, { status, priority, employee, search }) =>
  tasks.filter(
    (t) =>
      (!status   || t.status     === status)   &&
      (!priority || t.priority   === priority) &&
      (!employee || t.assignedTo === employee) &&
      (!search   || t.title.toLowerCase().includes(search.toLowerCase()))
  );
