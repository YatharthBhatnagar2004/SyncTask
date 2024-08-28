import React, { createContext, useState } from "react";
const TaskContext = createContext(null);
const TaskProvider = ({ children }) => {
  const [currTask, setCurrTask] = useState(null);
  return (
    <TaskContext.Provider value={{ currTask, setCurrTask }}>
      {children}
    </TaskContext.Provider>
  );
};
export { TaskProvider, TaskContext };
