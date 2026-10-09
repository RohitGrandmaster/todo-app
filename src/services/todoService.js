import apiRequest from './api';

async function getTodos() {
  return apiRequest('/todos', {
    method: 'GET',
  });
}

async function createTodo(todo) {
  return apiRequest('/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
  });
}

async function updateTodo(
  id,
  todo,
) {
  return apiRequest(`/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(todo),
  });
}

async function deleteTodo(id) {
  return apiRequest(`/todos/${id}`, {
    method: 'DELETE',
  });
}

export {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};