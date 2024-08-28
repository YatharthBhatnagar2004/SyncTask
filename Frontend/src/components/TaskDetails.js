import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { TaskContext } from "../contexts/TaskProvider.js";

const TaskDetails = ({ onUpdateTask }) => {
  const { currTask, setCurrTask } = useContext(TaskContext);

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [priority, setPriority] = useState("None"); // New state for priority
  const [responseMessage, setResponseMessage] = useState("");
  const [user, setUser] = useState(null);
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

  const formatDate = (isoDate) => {
    if (!isoDate) {
      console.error("Invalid ISO Date:", isoDate);
      return ""; // Return an empty string if isoDate is invalid
    }
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) {
        console.error("Invalid date object created from ISO date:", isoDate);
        return ""; // Return an empty string if date is invalid
      }
      // Adjust for local timezone offset
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60 * 1000);
      return localDate.toISOString().slice(0, 16);
    } catch (error) {
      console.error("Error formatting date:", error);
      return ""; // Return an empty string in case of error
    }
  };
  useEffect(() => {
    if (currTask) {
      setSummary(currTask.summary || "");
      setDescription(currTask.description || "");
      setPriority(currTask.priority || "None");
      setIsSync(currTask.isSync || false);

      // Handle potentially undefined start and end times safely
      setStart(
        formatDate(currTask.start) || new Date().toISOString().slice(0, 16)
      );
      setEnd(formatDate(currTask.end) || new Date().toISOString().slice(0, 16));
    }
  }, [currTask]);

  const handleSave = async (event) => {
    event.preventDefault();

    if (!user) {
      setResponseMessage("User is not authenticated.");
      return;
    }

    if (!currTask.eventId) {
      setResponseMessage("Event ID is missing.");
      return;
    }

    const updatedTask = {
      eventId: currTask.eventId,
      summary,
      description,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      priority,
      isSync,
    };

    try {
      const response = await axios.put(
        `http://localhost:8000/calendar/update-event`,
        updatedTask,
        {
          params: { email: user.email },
        }
      );

      setResponseMessage(response.data || "Event updated successfully!");
      setCurrTask(updatedTask);
      onUpdateTask(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      setResponseMessage("Failed to update event. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!user || !currTask.eventId) {
      setResponseMessage("Cannot delete task. Please try again.");
      return;
    }

    try {
      const response = await axios.delete(
        "http://localhost:8000/calendar/delete-event",
        {
          data: { eventId: currTask.eventId, isSync: currTask.isSync },
          params: { email: user.email },
        }
      );

      setResponseMessage(response.data.message || "Task deleted successfully!");
      setCurrTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      setResponseMessage("Failed to delete task. Please try again.");
    }
  };

  if (!currTask) {
    return (
      <div className="p-4 rounded-lg w-1/3">Select a task to view details</div>
    );
  }

  return (
    <div className="p-4 rounded-lg w-1/3">
      <h2 className="text-[40px] font-bold mb-3">Task Details:</h2>

      <input
        value={summary}
        placeholder="Title"
        onChange={(e) => setSummary(e.target.value)}
        type="text"
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

      <div className="mb-4">
        <label className="block text-gray-700">Priority</label>
        <select
          className="w-full p-2 border rounded-lg bg-gray-50"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="None">None</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
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

      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={handleDelete}
        >
          Delete Task
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
          onClick={handleSave}
        >
          Save changes
        </button>
      </div>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default TaskDetails;
