import { Badge } from '../ui/Badge.jsx';
import { Avatar } from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { statusColors, priorityColors } from '../../utils/helpers.js';
import { isOverdue, daysUntil } from '../../utils/dateUtils.js';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * TaskCard — displays a single task summary with action buttons.
 * Clicking the card calls onView.
 */
export default function TaskCard({ task, users, onView, onUpdate, onEdit, onDelete }) {
  const { currentUser, isAdmin } = useAuth();

  const assignee = users.find((u) => u.id === task.assignedTo);
  const assigner = users.find((u) => u.id === task.assignedBy);
  const overdue   = isOverdue(task.deadline, task.status);
  const du        = daysUntil(task.deadline);
  const canUpdate = !isAdmin && task.assignedTo === currentUser?.id;

  const deadlineClass = overdue ? 'urgent' : du <= 2 ? 'warning' : 'normal';
  const deadlineLabel = overdue
    ? `⚠ ${task.deadline}`
    : du === 0 ? 'Today'
    : du === 1 ? 'Tomorrow'
    : task.deadline;

  return (
    <div
      className={`task-card ${overdue ? 'overdue' : ''}`}
      onClick={() => onView(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onView(task)}
    >
      <div className="task-card-top">
        <div className="task-card-info">
          <div className="task-card-title">{task.title}</div>
          {task.description && (
            <div className="task-card-desc">{task.description}</div>
          )}
        </div>

        <div className="task-card-actions" onClick={(e) => e.stopPropagation()}>
          {canUpdate && (
            <Button variant="success" size="sm" onClick={() => onUpdate(task)}>
              Update
            </Button>
          )}
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
              Edit
            </Button>
          )}
          {isAdmin && (
            <Button variant="danger" size="sm" onClick={() => onDelete(task)}>
              Del
            </Button>
          )}
        </div>
      </div>

      <div className="task-card-meta">
        <div className="task-card-badges">
          <Badge label={task.status}   style={statusColors(task.status)}   />
          <Badge label={task.priority} style={priorityColors(task.priority)} />
          {assignee && (
            <span className="task-card-assignee">
              <Avatar name={assignee.name} size={16} />
              {assignee.name}
            </span>
          )}
          {assigner && assigner.id !== assignee?.id && (
            <span className="task-card-by">by {assigner.name}</span>
          )}
          {task.comments?.length > 0 && (
            <span className="task-card-comments">💬 {task.comments.length}</span>
          )}
        </div>

        {task.deadline && (
          <span className={`task-deadline ${deadlineClass}`}>
            {overdue ? '⚠ ' : du <= 2 && !overdue ? '⏰ ' : ''}
            {deadlineLabel}
          </span>
        )}
      </div>
    </div>
  );
}
