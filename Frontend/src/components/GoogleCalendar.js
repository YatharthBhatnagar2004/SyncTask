import React, { useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Cookies from "js-cookie";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("userData");
    const userData = userCookie ? JSON.parse(userCookie) : null;
    const email = userData ? userData.email : null;

    if (!email) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:8000/auth/google/calendar-events?email=${encodeURIComponent(email)}`,
      {
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setError("Failed to fetch events");
        setLoading(false);
      });
  }, []);

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    const userCookie = Cookies.get("userData");
    const userData = userCookie ? JSON.parse(userCookie) : null;
    const email = userData ? userData.email : null;

    fetch(
      `http://localhost:8000/calendar/change-date?email=${encodeURIComponent(email)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          start: start.toISOString(),
          end: end.toISOString(),
          summary: event.title,
          description: event.description || "",
          priority: event.priority || "normal",
        }),
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update event");
        }
        setEvents((prevEvents) =>
          prevEvents.map((evt) =>
            evt.id === updatedEvent.id ? updatedEvent : evt
          )
        );
      })
      .catch((error) => {
        console.error("Error updating event:", error);
        setError("Failed to update event");
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ height: "80vh" }}>
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onEventDrop={handleEventDrop}
      />
    </div>
  );
};

export default MyCalendar;
