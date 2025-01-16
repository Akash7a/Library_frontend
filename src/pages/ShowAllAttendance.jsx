import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Keep default styles for structure
import '../CalenderStyle.css'; // Import custom styles
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showStudentAttendance } from "../features/Student/StudentSlice.js";

const ShowAllAttendance = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector((state) => state.student);

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (studentId) {
      dispatch(showStudentAttendance({ studentId }));
    }
  }, [dispatch, studentId]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = monthNames[date.getMonth()];
  const currentYear = date.getFullYear();

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error fetching student details</div>;
  }

  const tileContent = ({ date, view }) => {
    if (view === 'month' && students && students.attendance) {
      const attendance = students.attendance.find(att => new Date(att.date).toDateString() === date.toDateString());
      if (attendance) {
        const bgColor = attendance.present ? 'bg-green-500' : 'bg-gray-200';
        return (
          <div
            className={`attendance-marker ${bgColor} text-white text-center rounded-full w-6 h-6 flex items-center justify-center`}
          >
            {attendance.present ? 'P' : 'A'}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Attendance Calendar of {students ? students.name : "Loading..."}
        </h1>
        <h2 className="text-lg font-medium text-gray-600 mt-2">
          {`${currentMonth} ${currentYear}`}
        </h2>
      </div>

      <div className="w-full max-w-[800px] p-4 bg-white shadow-lg rounded-lg">
        <Calendar
          onChange={setDate}
          value={date}
          className="custom-calendar"
          tileContent={tileContent}
        />
      </div>
    </div>
  );
};

export default ShowAllAttendance;