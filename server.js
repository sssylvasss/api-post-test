import express from "express";
import cors from "cors";
import mongoose from "mongoose";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/post-codalong";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const Task = mongoose.model("Task", {
  text: {
    type: String,
    required: true,
    minLength: 5,
  },
  complete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});


app.get("/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: "desc" }).limit(20).exec();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
const {text, complete} = req.body;
const task = new Task({text, complete});
try{
  const savedTask = await task.save();
  res.status(201).json(savedTask);
} catch (error) {
  res.status(400).json({message:"Could not save task to the database", error:error.errors});
}
 
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
