import { Router } from "express";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/", verifyJWT, isAdmin, getUsers);
router.post("/", verifyJWT, isAdmin, addUser);
router.put("/:id", verifyJWT, isAdmin, updateUser);
router.delete("/:id", verifyJWT, isAdmin, deleteUser);

export default router;
