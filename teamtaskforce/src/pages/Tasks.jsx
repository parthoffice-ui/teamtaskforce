// ─── Tasks Page ──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { useToast } from '../hooks/useToast.js';
import { TaskList, TaskFilters } from '../components/tasks/TaskList.jsx';
import { CreateTaskForm, ViewTaskModal, UpdateTaskForm, EditTaskForm } from '../components/tasks/TaskForms.jsx';
import { DeleteConfirm, Toast } from '../components/common/Toast.jsx';
import Button from '../components/ui/Button.jsx';

export function TasksPage() {
  const { isAdmin, currentUser } = useAuth();
  const { state } = useAppContext();
  const { visibleTasks, getFiltered, createTask, updateTask, editTask, deleteTask } = useTasks();
  const { toast, showToast } = useToast();

  const [filters, setFilters] = useState({ status: '', priority: '', employee: '', search: '' });
  const [modal,   setModal]   = useState(null);
  const [selTask, setSelTask] = useState(null);
  const [delConf, setDelConf] = useState(null);
  const [isMobile] = useState(window.innerWidth < 768);

  const { users } = state;
  const employees = users.filter((u) => u.role === 'employee');
  const filtered  = getFiltered(filters);

  const openView   = (t) => { setSelTask(t); setModal('view');   };
  const openUpdate = (t) => { setSelTask(t); setModal('update'); };
  const openEdit   = (t) => { setSelTask(t); setModal('edit');   };
  const closeModal = ()  => { setModal(null); setSelTask(null);  };

  const handleCreate = (form) => {
    const err = createTask(form);
    if (err) { showToast(err, 'err'); return err; }
    showToast('Task created! ✓');
    closeModal();
    return null;
  };

  const handleUpdate = (task, form) => { updateTask(task, form); showToast('Task updated ✓'); closeModal(); };
  const handleEdit   = (task, form) => {
    const err = editTask(task, form);
    if (err) { showToast(err, 'err'); return err; }
    showToast('Task saved ✓'); closeModal(); return null;
  };
  const handleDelete = (task) => { deleteTask(task.id); setDelConf(null); showToast('Task deleted', 'del'); };

  return (
    <div>
      {isAdmin && (
        <div className="flex justify-end mb-12">
          <Button onClick={() => setModal('create')}>+ New Task</Button>
        </div>
      )}

      <TaskFilters filters={filters} onChange={setFilters} employees={employees} isAdmin={isAdmin} />
      <div className="filter-count">{filtered.length} task{filtered.length !== 1 ? 's' : ''} found</div>

      <TaskList
        tasks={filtered} users={users}
        onView={openView} onUpdate={openUpdate} onEdit={openEdit} onDelete={setDelConf}
      />

      {/* Modals */}
      {modal === 'create' && (
        <CreateTaskForm assignableUsers={employees} onSubmit={handleCreate} onCancel={closeModal} isModal />
      )}
      {modal === 'view' && selTask && (
        <ViewTaskModal
          task={selTask} users={users} isAdmin={isAdmin} currentUserId={currentUser?.id}
          onUpdate={openUpdate} onEdit={openEdit} onDelete={setDelConf} onClose={closeModal}
        />
      )}
      {modal === 'update' && selTask && (
        <UpdateTaskForm task={selTask} onSubmit={handleUpdate} onBack={() => setModal('view')} onClose={closeModal} />
      )}
      {modal === 'edit' && selTask && (
        <EditTaskForm task={selTask} employees={employees} onSubmit={handleEdit} onClose={closeModal} />
      )}

      <DeleteConfirm item={delConf} onConfirm={handleDelete} onCancel={() => setDelConf(null)} />
      <Toast toast={toast} isMobile={isMobile} />
    </div>
  );
}

// ─── Create Task Page (Employee) ─────────────────────────────────────────────
import { useNavigate } from 'react-router-dom';

export function CreateTaskPage() {
  const { state }   = useAppContext();
  const { currentUser } = useAuth();
  const { createTask }  = useTasks();
  const { toast, showToast } = useToast();
  const navigate    = useNavigate();

  const assignable = state.users.filter((u) => u.role === 'employee' && u.id !== currentUser?.id);

  const handleCreate = (form) => {
    const err = createTask(form);
    if (err) { showToast(err, 'err'); return err; }
    showToast('Task created! ✓');
    navigate('/tasks');
    return null;
  };

  return (
    <div>
      <CreateTaskForm assignableUsers={assignable} onSubmit={handleCreate} onCancel={() => navigate('/tasks')} />
      <Toast toast={toast} isMobile={window.innerWidth < 768} />
    </div>
  );
}
