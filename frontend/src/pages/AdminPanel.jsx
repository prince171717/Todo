import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { handleError, handleSuccess } from "../lib/utils";
import { FaStreetView } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const AdminPanel = () => {
  const [storeData, setStoreData] = useState([]);
  const [viewTask, setViewTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [newTask, setNewTask] = useState("");
  const { user } = useAuth();

  const fetchAllUserTask = async () => {
    try {
      const res = await axiosInstance.get("/admin/all-tasks");

      setStoreData(res.data.allUserTask);
    } catch (error) {
      handleError(
        error.response?.data?.message || "Error fetching allfeedbacks"
      );
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAllUserTask();
    }
  }, [user]);

  const handleEdit = (data) => {
    setEditTask(data);
    setNewTask(data.task);
    // console.log(data)
  };

  const handleUpdate = async () => {
    try {
      const res = await axiosInstance.put(
        `/admin/edit-all-tasks/${editTask._id}`,
        { task: newTask }
      );

      // setStoreData((prev) =>
      //   prev.map((data) =>
      //     data._id === editTask._id ? { ...data, task: newTask } : data
      //   )
      // );
      await fetchAllUserTask();
      handleSuccess("Task update successfully");
      setEditTask(null);
    } catch (error) {
      handleError("Error in updating Task");
    }
  };

  const handleViewFeedback = (data) => {
    setViewTask(data.task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }
    try {
      const res = await axiosInstance.delete(`/admin/delete-tasks/${id}`);
      if (res.data.success) {
        handleSuccess(res.data.message);
        setStoreData(storeData.filter((data) => data._id !== id));
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Server Error");
    }
  };
  // console.log(storeData);

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Admin Feedback Dashboard
      </h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 border">Index</th>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">E-mail</th>
              <th className="p-3 border">Task</th>
              <th className="p-3 border">Completed </th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Update Date</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {storeData.length > 0 ? (
              storeData?.map((data, index) => (
                <tr key={data._id} className="text-center hover:bg-gray-100">
                  {console.log(data)}
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{data._id}</td>
                  <td className="p-3 border">{data.userId.name}</td>
                  <td className="p-3 border">{data.userId.email}</td>
                  <td className="p-3 border text-left max-w-[200px] break-words ">
                    {data.task}
                  </td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-sm ${
                        data.completed ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {data.completed ? "Completed" : "Pending"}
                    </span>
                  </td>

                  <td className="p-3 border">
                    {new Date(data.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">
                    {new Date(data.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border space-x-2 h-full space-y-2">
                    <button
                      title="view"
                      onClick={() => handleViewFeedback(data)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      <FaStreetView />
                    </button>
                    <button
                      title="edit"
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                      onClick={() => handleEdit(data)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      title="delete"
                      onClick={() => handleDelete(data._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      <MdDeleteForever />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No feedback available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* view task  */}

      {isModalOpen && viewTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">Feedback Details</h2>
            <p className="text-gray-800 break-words whitespace-pre-wrap">
              {viewTask}
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit task  */}

      {editTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit Feedback</h3>
            <textarea
              className="w-full p-2 border rounded-md"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => setEditTask(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
