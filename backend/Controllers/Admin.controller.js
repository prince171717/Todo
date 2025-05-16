import addTaskModel from "../Models/addTask.js";

export const allTask = async (req, res) => {
  try {
    const allUserTask = await addTaskModel
      .find()
      .populate("userId", "name email role");
    res.status(200).json({ success: true, allUserTask });
  } catch (error) {
    console.log("Error in fetching allTask admin controller", error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const editAllTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;

    const updateTask = await addTaskModel.findById(id);
    if (!updateTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    updateTask.task = task;
    await updateTask.save();
    res
      .status(200)
      .json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    console.log("Error in updating admin controller", error);
    return res
      .status(500)
      .json({ message: "Error in updating admin controller" });
  }
};

export const deleteAdminTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteTask = await addTaskModel.findById(id);

    if (!deleteTask) {
      return req
        .status(404)
        .json({ message: "Task Not Found", success: false });
    }
    await addTaskModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Task deleted successully", success: true });
  } catch (error) {
    console.log("Error in admin delete controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
