import TaskCard from './TaskCard.jsx';
import { EmptyState } from '../common/Toast.jsx';

/**
 * TaskList — renders a list of TaskCards or an empty state.
 */
export function TaskList({ tasks, users, onView, onUpdate, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return <EmptyState icon="📭" text="No tasks found" />;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          users={users}
          onView={onView}
          onUpdate={onUpdate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

/**
 * TaskFilters — search + filter bar for the tasks view.
 */
export function TaskFilters({ filters, onChange, employees, isAdmin }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });
  const hasFilters = filters.status || filters.priority || filters.employee || filters.search;

  return (
    <div className="card card-sm mb-14">
      <div className="filter-bar">
        <input
          className="form-input"
          style={{ flex: 1, minWidth: 120 }}
          placeholder="🔍 Search tasks..."
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
        />

        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={filters.status}
          onChange={(e) => set('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={filters.priority}
          onChange={(e) => set('priority', e.target.value)}
        >
          <option value="">All Priority</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        {isAdmin && (
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={filters.employee}
            onChange={(e) => set('employee', e.target.value)}
          >
            <option value="">All Members</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        )}

        {hasFilters && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onChange({ status: '', priority: '', employee: '', search: '' })}
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}
