import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { handleError, handleSuccess } from "../lib/utils";
import { axiosInstance } from "../lib/axios";
import { RxUpdate } from "react-icons/rx";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const Home = () => {
  const [addTask, setAddTask] = useState({
    userTask: "",
  });

  const [storeTask, setStoreTask] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all"); // all | pending | completed

  const handleChange = (e) => {
    setAddTask({ ...addTask, [e.target.name]: e.target.value });
  };

  const fetchtask = async () => {
    try {
      const res = await axiosInstance.get("/api/fetchtask");
      if (res.data.success) {
        setStoreTask(res.data.fetchUserTask);
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Error in fetching task");
    }
  };

  useEffect(() => {
    fetchtask();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userTask } = addTask;
    if (!userTask) {
      handleError("Task is required");
    }

    try {
      if (editId) {
        const res = await axiosInstance.put(
          `/api/updatetask/${editId}`,
          addTask,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.data.success) {
          handleSuccess(res.data.message);
          setAddTask({ userTask: "" });
          setEditId(null);
          fetchtask();
        }
      } else {
        const res = await axiosInstance.post("/api/addtask", addTask, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.data.success) {
          handleSuccess(res.data.message);
          setAddTask({ userTask: "" });
          fetchtask();
        }
      }
    } catch (error) {
      const messageFromBackend =
        error.response?.data?.message ||
        error.response?.data?.error?.details?.[0]?.message ||
        error.message;
      handleError(messageFromBackend);
      console.log(messageFromBackend);
    }
  };

  const handleEditTask = async (data) => {
    setEditId(data._id);
    setAddTask({ userTask: data.task });
  };

  const handleDeleteTask = async (id) => {
    if (!id) {
      handleError("Invalid Task ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this task")) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/api/deletetask/${id}`);

      if (res.data.success) {
        handleSuccess(res.data.message);
        setStoreTask(storeTask.filter((data) => data._id !== id));
      } else {
        handleError("Failed to delete task");
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Server Error");
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const res = await axiosInstance.put(`/api/updatetask/${id}`, {
        completed: !currentStatus,
      });
      if (res.data.success) {
        fetchtask();
      }
    } catch (error) {
      handleError(
        error.response?.data?.message || "Failed to update task status"
      );
    }
  };

  const filteredTasks = storeTask.filter((task) => {
    if (filter === "pending") return task.completed === false;
    if (filter === "completed") return task.completed === true;
    return true;
  });

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to clear all tasks?")) return;
    try {
      const res = await axiosInstance.delete("/api/deleteall");
      if (res.data.success) {
        handleSuccess(res.data.message);
        setStoreTask([]);
        fetchtask();
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Failed to clear all tasks");
    }
  };

  // console.log("storetask", storeTask);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="container flex flex-col justify-center items-center bg-white shadow-lg px-8 py-6 rounded-2xl w-full max-w-[500px]">
        <h1 className="mb-5 text-xl font-semibold">Add a new task</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
          <div className="flex items-center w-full">
            <input
              type="text"
              name="userTask"
              onChange={handleChange}
              value={addTask.userTask}
              placeholder="Enter a task"
              className="border-2 border-gray-300 bg-gray-50 text-gray-800 p-3 h-12 rounded-l-2xl flex-grow outline-none focus:ring-1 focus:ring-blue-400 transition-all"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 h-12 rounded-r-2xl hover:bg-blue-600 transition-all flex items-center justify-center"
              aria-label="Add task"
            >
              {editId ? <RxUpdate /> : <FaPlus className="w-5 h-5" />}
            </button>
          </div>
        </form>

        <div className="mt-4 w-full">
          <div className="flex justify-between my-3 text-sm text-gray-600">
            <div className="flex sm:gap-5">
              {/* <button onClick={() => setFilter("all")}>All</button>
              <button onClick={() => setFilter("pending")}>Pending</button>
              <button onClick={() => setFilter("completed")}>Completed</button> */}
              <div className="flex sm:gap-3 gap-1">
                {["all", "pending", "completed"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`sm:px-4 sm:py-1 p-2 rounded-full border transition-all duration-200 ${
                      filter === type
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-blue-100 hover:border-blue-400"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div
              onClick={handleDeleteAll}
              className="cursor-pointer sm:px-4 sm:py-1 p-2 text-red-500 hover:underline"
            >
              Clear All
            </div>
          </div>

          {filteredTasks.map((data) => (
            <div
              className="flex w-full items-center border-b py-2"
              key={data._id}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <input
                  type="checkbox"
                  checked={data.completed}
                  onChange={() =>
                    handleToggleComplete(data._id, data.completed)
                  }
                />
                {/* {console.log(data)} */}
                <p
                  className={`w-full max-w-[70%]  break-words whitespace-pre-wrap ${
                    data.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {data.task}
                </p>
                <div className="flex  gap-3 text-sm items-center">
                <button
                title="edit"
                  onClick={() => handleEditTask(data)}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                 <FaRegEdit className="h-5 w-5 text-gray-700"/>

                </button>
                <button
                title="delete"   // isse tooltip kehte hai
                  onClick={() => handleDeleteTask(data._id)}
                  className="text-red-500 hover:underline cursor-pointer"
                >
                 <MdDeleteForever className="h-6 w-6 text-gray-700"/>
                </button>
              </div>
              </div>
           
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
