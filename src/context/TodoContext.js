import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getItem,
  setItem,
} from '../storage/storage';

import APP_CONFIG from '../constants/appConfig';
import {createId} from '../utils/helpers';

const TodoContext = createContext(null);

const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Learn React Native',
    description: 'Learn components, props and hooks',
    completed: false,
    category: 'Learning',
    priority: 'high',
    dueDate: 'Today',
    reminder: false,
    favorite: true,
    deleted: false,
    createdAt: Date.now(),
  },

  {
    id: 2,
    title: 'Learn JavaScript',
    description: 'Practice arrays and objects',
    completed: true,
    category: 'Learning',
    priority: 'medium',
    dueDate: 'Tomorrow',
    reminder: false,
    favorite: false,
    deleted: false,
    createdAt: Date.now(),
  },

  {
    id: 3,
    title: 'Build Todo App',
    description: 'Create a complete CRUD application',
    completed: false,
    category: 'Project',
    priority: 'high',
    dueDate: 'Next week',
    reminder: false,
    favorite: true,
    deleted: false,
    createdAt: Date.now(),
  },
];

/*
  Existing saved todos ko normalize karne ke liye.
  Isse purane todos me missing fields automatically add ho jayenge.
*/
function normalizeTodo(todo) {
  return {
    id: todo.id ?? createId(),
    title: todo.title ?? '',
    description: todo.description ?? '',
    completed: todo.completed ?? false,
    category: todo.category ?? 'Personal',
    priority: todo.priority ?? 'medium',
    dueDate: todo.dueDate ?? 'No date',
    reminder: todo.reminder ?? false,
    favorite: todo.favorite ?? false,
    deleted: todo.deleted ?? false,
    createdAt: todo.createdAt ?? Date.now(),
  };
}

function TodoProvider({children}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
    Load todos from AsyncStorage
  */
  useEffect(() => {
    async function loadTodos() {
      try {
        const savedTodos = await getItem(
          APP_CONFIG.STORAGE_KEYS.TODOS,
          null,
        );

        if (Array.isArray(savedTodos)) {
          const normalizedTodos = savedTodos.map(normalizeTodo);

          setTasks(normalizedTodos);
        } else {
          setTasks(INITIAL_TASKS);
        }
      } catch (error) {
        console.log('Failed to load todos:', error);

        setTasks(INITIAL_TASKS);
      } finally {
        setLoading(false);
      }
    }

    loadTodos();
  }, []);

  /*
    Save todos whenever tasks change
  */
  useEffect(() => {
    if (!loading) {
      setItem(
        APP_CONFIG.STORAGE_KEYS.TODOS,
        tasks,
      ).catch(error => {
        console.log('Failed to save todos:', error);
      });
    }
  }, [tasks, loading]);

  /*
    ADD TODO
  */
  function addTodo(todo) {
    const newTodo = {
      ...todo,

      id: createId(),

      completed: false,

      favorite: todo.favorite ?? false,

      deleted: false,

      createdAt: Date.now(),
    };

    setTasks(currentTasks => [
      ...currentTasks,
      newTodo,
    ]);
  }

  /*
    UPDATE TODO
  */
  function updateTodo(id, updatedData) {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        String(task.id) === String(id)
          ? {
              ...task,
              ...updatedData,
            }
          : task,
      ),
    );
  }

  /*
    TOGGLE COMPLETE / ACTIVE
  */
  function toggleTodo(id) {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        String(task.id) === String(id)
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      ),
    );
  }

  /*
    TOGGLE FAVORITE
  */
  function toggleFavorite(id) {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        String(task.id) === String(id)
          ? {
              ...task,
              favorite: !task.favorite,
            }
          : task,
      ),
    );
  }

  /*
    SOFT DELETE
    Todo ko permanently remove nahi karta.
    Sirf Trash me bhejta hai.
  */
  function deleteTodo(id) {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        String(task.id) === String(id)
          ? {
              ...task,
              deleted: true,
            }
          : task,
      ),
    );
  }

  /*
    RESTORE FROM TRASH
  */
  function restoreTodo(id) {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        String(task.id) === String(id)
          ? {
              ...task,
              deleted: false,
            }
          : task,
      ),
    );
  }

  /*
    PERMANENT DELETE
    Trash se completely remove karta hai.
  */
  function permanentlyDeleteTodo(id) {
    setTasks(currentTasks =>
      currentTasks.filter(
        task =>
          String(task.id) !== String(id),
      ),
    );
  }

  /*
    DELETE ALL TODOS
    Current existing behaviour preserve kiya gaya hai.
  */
  function clearTodos() {
    setTasks([]);
  }

  /*
    FIND TODO BY ID
  */
  function getTodoById(id) {
    return tasks.find(
      task =>
        String(task.id) === String(id),
    );
  }

  /*
    GET ACTIVE TODOS
  */
  function getActiveTodos() {
    return tasks.filter(
      task =>
        !task.completed &&
        !task.deleted,
    );
  }

  /*
    GET COMPLETED TODOS
  */
  function getCompletedTodos() {
    return tasks.filter(
      task =>
        task.completed &&
        !task.deleted,
    );
  }

  /*
    GET FAVORITE TODOS
  */
  function getFavoriteTodos() {
    return tasks.filter(
      task =>
        task.favorite &&
        !task.deleted,
    );
  }

  /*
    GET TRASH TODOS
  */
  function getTrashTodos() {
    return tasks.filter(
      task => task.deleted,
    );
  }

  return (
    <TodoContext.Provider
      value={{
        tasks,
        loading,

        addTodo,
        updateTodo,

        toggleTodo,
        toggleFavorite,

        deleteTodo,
        restoreTodo,
        permanentlyDeleteTodo,

        clearTodos,

        getTodoById,

        getActiveTodos,
        getCompletedTodos,
        getFavoriteTodos,
        getTrashTodos,
      }}>
      {children}
    </TodoContext.Provider>
  );
}

function useTodoContext() {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error(
      'useTodoContext must be used inside TodoProvider.',
    );
  }

  return context;
}

export {
  TodoProvider,
  useTodoContext,
};