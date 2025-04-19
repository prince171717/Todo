import { Router } from "express";
import { allTask, deleteAdminTask, editAllTask } from "../Controllers/Admin.controller.js";

const router = Router()

router.get('/all-tasks', allTask);
router.put('/edit-all-tasks/:id', editAllTask);
router.delete('/delete-tasks/:id', deleteAdminTask);



export default router