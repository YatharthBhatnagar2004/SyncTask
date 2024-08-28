import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { gapi } from "gapi-script";
import GoogleCalendar from "./GoogleCalendar";

function Calendar() {
  return (
    <div className="w-screen h-screen bg-[rgb(228,224,138)] p-9">
      <div className="rounded-lg shadow-md bg-gray-100 flex justify-evenly relative h-full">
        <Sidebar highlight={2} />
        <div className="w-[80vw]">
          <GoogleCalendar />
        </div>
      </div>
    </div>
  );
}

export default Calendar;
