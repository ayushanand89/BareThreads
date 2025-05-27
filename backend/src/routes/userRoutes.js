import { Router } from "express"; 

const router = Router(); 

// @route POST /api/user/register
// @desc Register a new user
// @access Public
router.post("/register", async(req, res) => {
    const { name, email, password } = req.body; 

})