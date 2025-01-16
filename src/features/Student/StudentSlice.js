import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000";

const initialState = {
    error: null,
    pending: false,
    success: false,
    message: null,
    students: null,
};

export const getStudents = createAsyncThunk("student/students", async (_, thunkApi) => {
    try {
        const response = await axios.get(`${API_URL}/api/v1/student/getStudents`, { withCredentials: true });
        console.log("get student response", response)
        return response.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data || "Invalid token");
    }
});

export const addStudents = createAsyncThunk("student/addStudents", async (userData, thunkApi) => {
    try {
        const response = await axios.post(`${API_URL}/api/v1/student/addNewStudent`, userData, { withCredentials: true });
        console.log("adding student response");
        return response.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data || "Invalid token");
    }
});

export const deleteStudent = createAsyncThunk("student/deleteStudent", async (studentId, thunkApi) => {
    try {
        const response = await axios.delete(`${API_URL}/api/v1/student/delete/${studentId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data || "Invalid token");
    }
});

export const updateStudent = createAsyncThunk("student/updateStudent", async ({ studentId, updateData }, thunkApi) => {
    try {
        const response = await axios.put(`${API_URL}/api/v1/student/update/${studentId}`, updateData, { withCredentials: true });
        console.log("update response", response.data)
        return response.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data || "Invalid token");
    }
});

export const markStudentAttendance = createAsyncThunk("student/studentAttendance", async ({ studentId }, thunkApi) => {
    try {
        const response = await axios.post(`${API_URL}/api/v1/student/markAttendance/${studentId}`,{}, { withCredentials: true });
        console.log("attendance response", response.data);
        return response.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data || "Invalid token");
    }
});
export const showStudentAttendance = createAsyncThunk(
    "student/showAttendance",
    async ({ studentId }, thunkApi) => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/student/showStudentAttendance/${studentId}`,
          { withCredentials: true }
        );
        console.log("show attendance response", response.data);
        return response.data;
      } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data || "Invalid token");
      }
    }
  );
const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStudents.pending, (state) => {
                state.pending = true;
                state.message = "Request in Progress";
            })
            .addCase(getStudents.fulfilled, (state, action) => {
                state.pending = false;
                state.error = null;
                state.success = true;
                state.message = action.payload.message;
                state.students = action.payload.myStudents || [];
            })
            .addCase(getStudents.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
                state.message = "Failed to get students.";
            });

        builder
            .addCase(addStudents.pending, (state) => {
                state.pending = true;
                state.message = "Request in Progress";
            })
            .addCase(addStudents.fulfilled, (state, action) => {
                state.pending = false;
                state.error = null;
                state.success = true;
                state.students = action.payload.myStudents;
                state.message = action.payload?.message || "Student added successfully.";

                thunkApi.dispatch(getStudents());
            })
            .addCase(addStudents.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
                state.message = "Failed to add students.";
            });

        builder
            .addCase(deleteStudent.pending, (state) => {
                state.pending = true;
                state.message = "Deleting student...";
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.pending = false;
                state.error = null;
                state.success = true;
                state.message = action.payload.message || "Student deleted successfully.";
                const studentId = action.payload.id;
                state.students = state.students.filter(student => student._id !== studentId);
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
                state.message = "Failed to delete student.";
            });
        builder
            .addCase(updateStudent.pending, (state) => {
                state.pending = true;
                state.message = "Updating student...";
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.pending = false;
                state.error = null;
                state.success = true;
                state.message = action.payload?.message || "Student updated successfully.";

                const updatedStudent = action.payload.student;
                state.students = state.students.map(student =>
                    student._id === updatedStudent._id ? updatedStudent : student
                );
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
                state.message = "Failed to update student.";
            });
        builder
            .addCase(markStudentAttendance.pending, (state) => {
                state.pending = true;
                state.message = "Marking attendance...";
            })
            .addCase(markStudentAttendance.fulfilled, (state, action) => {
                state.pending = false;
                state.error = null;
                state.message = action.payload?.message || "Attendance marked successfully.";
            
                const updatedStudent = action.payload.student;
            
                state.students = state.students.map(student => student._id === updatedStudent._id ? updatedStudent : student);
            
            })
            .addCase(markStudentAttendance.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
                state.message = action.payload?.message || "Failled to mark attendance";
            });
        builder
            .addCase(showStudentAttendance.pending,(state)=>{
                state.pending = true;
                state.message = "Fetching attendance...";
            })
            .addCase(showStudentAttendance.fulfilled,(state,action)=>{
                state.pending = false;
                state.error = null;
                state.success = true;
                state.message = action.payload?.message || "Attendance fetched successfully.";
                state.students = action.payload.student || [];
            })
            .addCase(showStudentAttendance.rejected,(state,action)=>{
                state.pending = false;
                state.error = action.payload;
                state.message = action.payload?.message || "Failed to fetch attendance";
            });
    }
});

export const { clearError, clearSuccess } = studentSlice.actions;
export default studentSlice.reducer;