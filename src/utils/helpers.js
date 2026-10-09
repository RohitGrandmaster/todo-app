function createId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function calculateTodoStats(tasks) {
  // Trash items ignore
  const list = tasks.filter(task => !task.deleted);

  const total = list.length;

  const completed = list.filter(
    task => task.completed,
  ).length;

  const active = total - completed;

  const highPriority = list.filter(
    task =>
      task.priority === 'high' &&
      !task.completed,
  ).length;

  const dueToday = list.filter(
    task =>
      task.dueDate === 'Today' &&
      !task.completed,
  ).length;

  const favorites = list.filter(
    task => task.favorite,
  ).length;

  const completionPercentage =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    active,
    highPriority,
    dueToday,
    favorites,
    completionPercentage,
  };
}

export {
  createId,
  calculateTodoStats,
};