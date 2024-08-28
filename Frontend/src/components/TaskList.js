import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { TaskContext } from "../contexts/TaskProvider.js";

const TaskList = ({
  tasks,
  handleUpdateTask,
  addTaskButton,
  setAddTaskButton,
}) => {
  const { currTask, setCurrTask } = useContext(TaskContext);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [priority, setPriority] = useState("None");
  const [sortOption, setSortOption] = useState("Time"); // Default sort option
  const [responseMessage, setResponseMessage] = useState("");
  const [user, setUser] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [isSync, setIsSync] = useState(false);

  useEffect(() => {
    const userDataCookie = Cookies.get("userData");
    if (userDataCookie) {
      const userData = JSON.parse(userDataCookie);
      setUser(userData);
    } else {
      console.error("No user data found in cookies");
    }
  }, []);

  const handleCheckboxChange = async (task) => {
    try {
      const updatedTask = {
        ...task,
        isComplete: !task.isComplete,
      };

      const response = await axios.put(
        "http://localhost:8000/calendar/complete-event",
        {
          eventId: updatedTask.eventId,
          isComplete: updatedTask.isComplete,
        },
        {
          params: { email: user.email },
        }
      );

      setResponseMessage("Task updated successfully!");
      handleUpdateTask(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      setResponseMessage("Failed to update task. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setResponseMessage("User is not authenticated.");
      return;
    }

    const eventData = {
      isComplete: false,
      isSync,
      summary,
      description,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      priority,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/calendar/schedule-event",
        eventData,
        {
          params: { email: user.email },
        }
      );
      setEventId(response.data.eventId);
      setResponseMessage(
        response.data.message || "Event scheduled successfully!"
      );
      setSummary("");
      setDescription("");
      setStart("");
      setEnd("");
      setPriority("None");
      setIsSync(false);
    } catch (error) {
      console.error("Error scheduling event:", error);
      setResponseMessage("Failed to schedule event. Please try again.");
    }
  };

  const onTaskClick = (task) => {
    setCurrTask(task);
  };

  useEffect(() => {
    if (currTask !== null) {
      console.log("currTask", currTask);
    }
  }, [currTask]);
  const sortTasks = (tasks, sortOption) => {
    switch (sortOption) {
      case "Time":
        return tasks.sort((a, b) => new Date(a.start) - new Date(b.start));
      case "Priority":
        // Define priority order such that High has the highest value
        const priorityOrder = { High: 1, Medium: 2, Low: 3, None: 4 };
        return tasks.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
      case "Completed":
        return tasks.sort((a, b) => b.isComplete - a.isComplete);
      default:
        return tasks;
    }
  };

  const sortedTasks = sortTasks([...tasks], sortOption);

  return (
    <div className="border-r-[2px] border-solid border-[rgb(228,224,138)]">
      <div className="pr-5 pt-4 h-full rounded-lg w-[40vw] overflow-auto ">
        <h2 className="text-[40px] font-bold mb-4">Tasks</h2>
        <button
          onClick={() => setAddTaskButton(!addTaskButton)}
          className={`p-2 bg-green-300 rounded-lg`}
        >
          {!addTaskButton ? "Cancel" : "Add Task"}
        </button>

        <div className="mb-4">
          <label className="block text-gray-700">Sort by:</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="Time">Time</option>
            <option value="Priority">Priority</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <form className={`${!addTaskButton ? "block" : "hidden"} `}>
          <div className="p-4 rounded-lg w-[100%] border-solid border-gray-200 border-[1px] mb-5">
            <h2 className="text-[30px] text-center w-full font-bold mb-3">
              Add Task:
            </h2>

            <input
              value={summary}
              placeholder="Title"
              onChange={(e) => setSummary(e.target.value)}
              text="text"
              className="text-xl font-medium pl-2 mb-4 w-[100%] bg-gray-50"
            />

            <div className="mb-4">
              <textarea
                className="w-full p-2 border bg-gray-50 rounded-lg"
                placeholder="Description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Start date</label>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded-lg"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Due date</label>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded-lg"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>

            <div className="mb-4 flex ">
              <label className="block text-gray-700">Priority</label>
              <select
                className="w p-2 ml-3 border rounded-lg"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="None">None</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="mb-4">
              <p className="relative pl-8 ">
                <input
                  type="checkbox"
                  className="form-checkbox absolute left-2  h-5 w-5 bg-[hsl(237,100%,68%)] rounded"
                  checked={isSync}
                  onChange={() => setIsSync(!isSync)}
                />
                Sync to Google Calendar
              </p>
            </div>

            <div className="flex justify-between ">
              {/* {responseMessage && <p>{responseMessage}</p>} */}
              <button></button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg "
                onClick={handleSubmit}
              >
                Add
              </button>
            </div>
          </div>
        </form>

        <ul className="space-y-2">
          {sortedTasks.map((task) => (
            <li
              key={task.id}
              className="cursor-pointer pl-8 relative p-2 border rounded-lg"
              onClick={() => onTaskClick(task)}
            >
              <input
                type="checkbox"
                id="checkbox"
                className="form-checkbox absolute left-2 h-5 w-5 bg-[rgb(91,98,255)] rounded"
                checked={task.isComplete}
                onChange={() => handleCheckboxChange(task)}
              />
              {task.summary}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
