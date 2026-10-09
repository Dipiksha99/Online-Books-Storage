const exp = require("express");

const router = exp.Router();

const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    await user.save();

    res.send("User added successfully");
  } catch (error) {
    console.log(error);

    res.status(500).send("Error adding User");
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const ismatch = await bcrypt.compare(req.body.password, user.password);
    console.log("Password matched:", ismatch);

    if (!ismatch) {
      return res.status(401).send("Invalid email or password");
    }

    console.log("JWT secret loaded:", Boolean(process.env.JWT_SECRET));

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send("Error adding User");
  }
});

module.exports = router;

// router.put("/:_id", async (req, res) => {

//     try {

//         const user = await User.findByIdAndUpdate(
//             req.params._id,
//             req.body,
//             { new: true }
//         );

//         console.log(user);

//         res.json(user);

//     } catch (error) {

//         console.log(error);

//         res.status(400).send(error.message);

//     }

// });

// router.get("/", async (req, res) => {

//     try {

//         const users = await User.find();

//         console.log(users);

//         res.json(users);

//     } catch (error) {

//         console.log(error);

//         res.status(500).send("Error fetching users");

//     }

// });

// router.get("/:_id", async (req, res) => {

//     try {

//         const user = await User.findById(req.params._id);

//         console.log(user);

//         if (!user) {
//             return res.status(404).send("User not found");
//         }

//         res.json(user);

//     } catch (error) {

//         console.log(error);

//         res.status(400).send("Incorrect book ID");

//     }

// });

// router.delete("/:_id", async (req, res) => {

//     try {

//         const user = await User.findByIdAndDelete(req.params._id);

//         console.log(user);

//         if (!user) {
//             return res.status(404).send("User not found");
//         }

//         res.json(user);

//     } catch (error) {

//         console.log(error);

//         res.status(400).send("Incorrect user ID");

//     }

// });

// module.exports = router;
