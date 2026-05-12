/**
 * useTasks — task operations via Firestore (real-time sync).
 */

import { useAppContext } from '../context/AppContext.jsx';
import { useAuth }       from '../context/AuthContext.jsx';
import { buildTask, applyTaskEdit, applyTaskUpdate, filterTasks } from '../services/taskService.js';
import { taskDoc, notifDoc, fsSet, fsUpdate, fsDelete } from '../firebase/db.js';
import { uid }    from '../utils/dateUtils.js';
import { ROLES }  from '../utils/constants.js';

export function useTasks() {
  const { state, addNotif } = useAppContext();
  const { currentUser, isAdmin } = useAuth();
  const { tasks, users } = state;

  const visibleTasks = isAdmin
    ? tasks
    : tasks.filter((t) => t.assignedTo === currentUser?.id);

  const getFiltered = (filters) => filterTasks(visibleTasks, filters);

  // ─── Create Task ────────────────────────────────────────────────────────────
  const createTask = async (formData) => {
    const { title, assignedTo, priority, deadline, description } = formData;
    if (!title?.trim() || !assignedTo) return 'Title and Assignee are required';

    if (!isAdmin) {
      const assignee = users.find((u) => u.id === assignedTo);
      if (assignee?.role === ROLES.ADMIN) return 'Cannot assign tasks to Boss';
    }

    const task = buildTask({
      title, description, assignedTo, assignedBy: currentUser.id,
      priority, deadline, creatorName: currentUser.name,
    });

    await fsSet(taskDoc(task.id), task);

    const emp = users.find((u) => u.id === assignedTo);
    if (emp) await addNotif(`New task from ${currentUser.name}: "${task.title}"`, emp.id);
    if (!isAdmin) {
      const admin = users.find((u) => u.role === ROLES.ADMIN);
      if (admin) await addNotif(`${currentUser.name} assigned task to ${emp?.name}: "${task.title}"`, admin.id);
    }

    return null;
  };

  // ─── Edit Task (admin) ──────────────────────────────────────────────────────
  const editTask = async (task, changes) => {
    if (!changes.title?.trim()) return 'Title is required';
    const updated = applyTaskEdit(task, changes, currentUser.name);
    await fsSet(taskDoc(task.id), updated);
    return null;
  };

  // ─── Update Task status + comment (employee) ────────────────────────────────
  const updateTask = async (task, { status, comment, reason }) => {
    const updated = applyTaskUpdate(task, { status, comment, reason }, currentUser.name);
    const fixedComments = updated.comments.map((c) =>
      c.byId === null ? { ...c, byId: currentUser.id } : c
    );
    await fsSet(taskDoc(task.id), { ...updated, comments: fixedComments });

    const admin = users.find((u) => u.role === ROLES.ADMIN);
    if (admin && admin.id !== currentUser.id)
      await addNotif(`${currentUser.name} updated "${task.title}" → ${status}`, admin.id);
    if (task.assignedBy !== currentUser.id && task.assignedBy !== admin?.id)
      await addNotif(`${currentUser.name} updated "${task.title}" → ${status}`, task.assignedBy);

    return null;
  };

  // ─── Delete Task (admin) ────────────────────────────────────────────────────
  const deleteTask = async (taskId) => {
    await fsDelete(taskDoc(taskId));
  };

  return { tasks, visibleTasks, getFiltered, createTask, editTask, updateTask, deleteTask };
}
