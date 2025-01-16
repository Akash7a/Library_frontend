import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudents, deleteStudent, markStudentAttendance, showStudentAttendance } from '../features/Student/StudentSlice.js';
import { useNavigate,Link } from 'react-router-dom';
import { loadAdminFromToken } from '../features/Auth/AuthSlice.js';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students, pending, error } = useSelector((state) => state.student);
  const { admin, pending: authPending } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getStudents());
  }, [dispatch]);

  useEffect(()=>{
   if(!admin){
    dispatch(loadAdminFromToken());
   }
  },[dispatch,admin])

  // Handle Delete Student
  const handleDelete = (studentId) => dispatch(deleteStudent(studentId));

  // Handle Update Student
  const handleUpdate = (studentId) => navigate('/updateStudent', { state: { studentId } });

  const today = new Date().toDateString();

  const getTodaysAttendance = (attendance) => {
    return attendance.find((record) => new Date(record.date).toDateString() === today);
  };

  if (authPending) {
    return <div>Loading admin data...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400">
      <div className="p-4 shadow-md bg-white">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-indigo-700">Student Dashboard</h1>
          <div className="text-lg text-indigo-600">
            Welcome, {admin?.username || 'Admin not found.'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <div className="bg-white shadow-xl p-6 transform transition duration-300 hover:scale-105">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Student List</h2>
            <button
              className="bg-indigo-600 text-white py-2 px-4 hover:bg-indigo-700 text-sm sm:text-base"
              onClick={() => navigate('/addNewStudent')}
            >
              Add New Student
            </button>
          </div>

          {pending ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600">
              {error.message || JSON.stringify(error)}
            </div>
          ) : students?.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-lg p-4">
              <table className="min-w-full table-auto">
                <thead className="bg-indigo-100 text-indigo-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Subscription</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {students.map((student) => {
                    const todaysAttendance = getTodaysAttendance(student.attendance);
                    return (
                      <tr key={student._id} className="hover:bg-indigo-50 transition duration-200">
                        <td className="px-4 py-2">{student.name}</td>
                        <td className="px-4 py-2">
                          {student.remainingDays} days
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`font-semibold ${student.isSubscriptionActive ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {student.isSubscriptionActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-2 flex space-x-2">
                          <button
                            className="bg-green-500 text-white py-1 px-3 hover:bg-green-600 text-xs sm:text-sm"
                            onClick={() => handleUpdate(student._id)}
                          >
                            Update
                          </button>
                          <button
                            className="bg-red-500 text-white py-1 px-3 hover:bg-red-600 text-xs sm:text-sm"
                            onClick={() => handleDelete(student._id)}
                          >
                            Delete
                          </button>
                          <button
                            className={`text-white py-1 px-3 hover:bg-red-600 text-xs sm:text-sm ${
                              todaysAttendance && todaysAttendance.present ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            onClick={() => dispatch(markStudentAttendance({ studentId: student._id }))}
                          >
                            {todaysAttendance ? (todaysAttendance.present ? 'Present' : 'Absent') : 'Absent'}
                          </button>
                          <button className="bg-red-500 text-white py-1 px-3 hover:bg-red-600 text-xs sm:text-sm">
                            <Link to="/showAllAttendance" onClick={() => dispatch(showStudentAttendance({ studentId: student._id }))}>
                              All Attendance
                            </Link>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-600">No students available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;