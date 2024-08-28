import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import TaskList from "./TaskList";
import TaskDetails from "./TaskDetails";
import { TaskContext } from "../contexts/TaskProvider";
import axios from "axios";
import Cookies from "js-cookie";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userData = Cookies.get("userData");
        if (userData) {
          const user = JSON.parse(userData);
          const response = await axios.get(
            "http://localhost:8000/calendar/events",
            {
              params: { email: user.email },
              withCredentials: true, // Ensure cookies are sent with request
            }
          );
          setEvents(response.data || []); // Directly set the data
        } else {
          console.error("User is not authenticated.");
          navigate("/login");
        }
      } catch (error) {
        console.error(
          "Error fetching events:",
          error.response ? error.response.data : error.message
        );
        setResponseMessage("Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate, events]);

  const { tasks, setTasks } = useContext(TaskContext);
  const [currTask, setCurrTask] = useState({
    summary: "",
    description: "",
    start: new Date().toISOString(),
    end: new Date().toISOString(),
  });

  // const handleSelectTask = (task) => {
  //   setCurrTask(task);
  //   // console.log("currTask", currTask);
  // };

  const handleUpdateTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    setCurrTask(updatedTask); // Optionally, update the selected task as well
  };

  // const addTask = (newTask) => {
  //   const newId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
  //   setTasks([...tasks, { id: newId, ...newTask }]);
  // };

  const [addTaskButton, setAddTaskButton] = useState(false);

  return (
    // bg-[rgb(228,224,138)]
    <div className="w-screen h-screen bg-[rgb(228,224,138)] p-9">
      <div className=" rounded-lg shadow-md bg-gray-100 flex justify-evenly h-full">
        <Sidebar highlight={1} />
        <TaskList
          tasks={events}
          // onTaskClick={}
          // onAddTask={addTask}
          handleUpdateTask={handleUpdateTask}
          addTaskButton={addTaskButton}
          setAddTaskButton={setAddTaskButton}
        />
        <TaskDetails
          // currTask={currTask}
          // setCurrTask={setCurrTask}
          // tasks={events}
          onUpdateTask={handleUpdateTask}
        />
      </div>
    </div>
  );
}

export default Home;
