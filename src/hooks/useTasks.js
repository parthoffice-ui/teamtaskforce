import { useAppContext } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { buildTask, applyTaskEdit, applyTaskUpdate, filterTasks } from '../services/taskService.js';
import { ROLES } from '../utils/constants.js';

/**
 * useTasks — all task-related operations and derived data.
 */
export function useTasks() {
  const { state, dispatch, addNotif } = useAppContext();
  const { currentUser, isAdmin } = useAuth();

  const { tasks, users } = state;

  // Tasks visible to current user
  const visibleTasks = isAdmin
    ? tasks
    : tasks.filter((t) => t.assignedTo === currentUser?.id);

  // Apply filters to visible tasks
  const getFiltered = (filters) => filterTasks(visibleTasks, filters);

  /**
   * Create a new task
   * Returns error string on failure, null on success
   */
  const createTask = (formData) => {
    const { title, assignedTo, priority, deadline, description } = formData;

    if (!title?.trim() || !assignedTo) return 'Title and Assignee are required';

    // Employees cannot assign to admin
    if (!isAdmin) {
      const assignee = users.find((u) => u.id === assignedTo);
      if (assignee?.role === ROLES.ADMIN) return 'Cannot assign tasks to Boss';
    }

    const task = buildTask({
      title, description, assignedTo, assignedBy: currentUser.id,
      priority, deadline, creatorName: currentUser.name,
    });

    dispatch({ type: 'ADD_TASK', payload: task });

    // Notify assignee
    const emp = users.find((u) => u.id === assignedTo);
    if (emp) addNotif(`New task from ${currentUser.name}: "${task.title}"`, emp.id);

    // Notify admin if employee assigned
    if (!isAdmin) {
      const admin = users.find((u) => u.role === ROLES.ADMIN);
      if (admin) addNotif(`${currentUser.name} assigned task to ${emp?.name}: "${task.title}"`, admin.id);
    }

    return null; // success
  };

  /**
   * Edit an existing task (admin)
   */
  const editTask = (task, changes) => {
    if (!changes.title?.trim()) return 'Title is required';
    const updated = applyTaskEdit(task, changes, currentUser.name);
    dispatch({ type: 'UPDATE_TASK', payload: updated });
    return null;
  };

  /**
   * Update task status + add comment (employee)
   */
  const updateTask = (task, { status, comment, reason }) => {
    const updated = applyTaskUpdate(task, { status, comment, reason }, currentUser.name);
    // Fix: set userId on comment
    const fixedComments = updated.comments.map((c) =>
      c.byId === null ? { ...c, byId: currentUser.id } : c
    );
    const final = { ...updated, comments: fixedComments };
    dispatch({ type: 'UPDATE_TASK', payload: final });

    // Notify admin
    const admin = users.find((u) => u.role === ROLES.ADMIN);
    if (admin && admin.id !== currentUser.id)
      addNotif(`${currentUser.name} updated "${task.title}" → ${status}`, admin.id);

    // Notify original assigner if different
    if (task.assignedBy !== currentUser.id && task.assignedBy !== admin?.id)
      addNotif(`${currentUser.name} updated "${task.title}" → ${status}`, task.assignedBy);

    return null;
  };

  /**
   * Delete a task (admin)
   */
  const deleteTask = (taskId) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  return {
    tasks,
    visibleTasks,
    getFiltered,
    createTask,
    editTask,
    updateTask,
    deleteTask,
  };
}
