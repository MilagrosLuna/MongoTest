import { useState, useEffect } from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

interface Task {
  _id: string;
  task: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [updateTask, setUpdateTask] = useState<{ id: string; value: string }>({
    id: "",
    value: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTasks(data.data);
  };

  const addTask = async () => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ task: newTask }),
    });
    const data = await response.json();
    if (response.ok) {
      setTasks((prevTasks) => [...prevTasks, data.data]);
      setNewTask("");
    }
  };

  const updateExistingTask = async (id: string) => {
    const response = await fetch("/api/tasks", {
      method: "PUT",
      body: JSON.stringify({ id, update: { task: updateTask.value } }),
    });
    if (response.ok) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, task: updateTask.value } : task
        )
      );
      setUpdateTask({ id: "", value: "" });
    }
  };

  const deleteTask = async (id: string) => {
    const response = await fetch("/api/tasks", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    }
  };

  const cancelUpdate = () => {
    setUpdateTask({ id: "", value: "" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-50 to-blue-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Lista de Tareas </h1>
      <div className="w-full max-w-md space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow border rounded px-4 py-2"
            placeholder="Nueva tarea"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white rounded px-4 py-2 transition duration-200 hover:bg-blue-600"
          >
            Agregar
          </button>
        </div>
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task._id} className="flex justify-between items-center py-2">
              {updateTask.id === task._id ? (
                <>
                  <input
                    type="text"
                    value={updateTask.value}
                    onChange={(e) => setUpdateTask({ ...updateTask, value: e.target.value })}
                    className="flex-grow border rounded px-4 py-2"
                  />
                  <button
                    onClick={() => updateExistingTask(task._id)}
                    className="text-green-500 hover:text-green-600 ml-2"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={cancelUpdate}
                    className="text-gray-500 hover:text-gray-600 ml-2"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-800">{task.task}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setUpdateTask({ id: task._id, value: task.task })}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaPencilAlt className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
