import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "List all rooms" });
});

router.post("/", (req, res) => {
  res.json({ message: "Create a room" });
});

router.get("/:id", (req, res) => {
  res.json({ message: "Get a room" });
});
router.put("/:id", (req, res) => {
  res.json({ message: "Update a room" });
});
router.delete("/:id", (req, res) => {
  res.json({ message: "Delete a room" });
});

export default router;
