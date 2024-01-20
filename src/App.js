import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingEmployee, setEditingEmployee] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
      setId(response.data.lenght)
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const handleFormChange = (e, employeeId) => {
    setFormData({
      ...formData,
      [employeeId]: { ...formData[employeeId], [e.target.name]: e.target.value },
    });
  };

  const handleFormSubmit = async (e, rId) => {
    e.preventDefault();
   
    try {
      if (editingEmployee) {
        // If formData for this employeeId exists, update the employee
        await axios.put(`http://localhost:5000/api/employees/${rId}`, formData[rId]);
      } else {
        // If no formData, add a new employee
        await axios.post('http://localhost:5000/api/employees', formData[rId]);
      }

      // Clear the form data and reload the employee data
      setFormData({});
      setEditingEmployee(false);
      fetchData();
    } catch (error) {
      console.error('Error submitting data:', error.message);
    }
  };
  const handleUpdateClick = (employeeId) => {
    // Find the selected employee by employeeId
    const selectedEmployee = employees.find((employee) => employee.id === employeeId);
   
    // Set the original data into the formData state
    setFormData({
      [employeeId]: {
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        email: selectedEmployee.email,
        salary: selectedEmployee.salary,
        date: selectedEmployee.date,
      },
    });
  
    // Set the editingEmployee state to the clicked employeeId
    setId(selectedEmployee.id);
    setEditingEmployee(true);
  };

  const handleDelete = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${employeeId}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error.message);
    }
  };

  return (
    <div>
      <h1>React MySQL CRUD App</h1>
      <form onSubmit={(e) => handleFormSubmit(e, id)}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            onChange={(e) => handleFormChange(e, id)}
            value={formData[id]?.firstName || ''}
            // readOnly={!editingEmployee}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            onChange={(e) => handleFormChange(e, id)}
            value={formData[id]?.lastName || ''}
            // readOnly={!editingEmployee}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            onChange={(e) => handleFormChange(e, id)}
            value={formData[id]?.email || ''}
            // readOnly={!editingEmployee}
          />
        </label>
        <label>
          Salary:
          <input
            type="text"
            name="salary"
            onChange={(e) => handleFormChange(e, id)}
            value={formData[id]?.salary || ''}
            // readOnly={!editingEmployee}
          />
        </label>
        <label>
          Date:
          <input
            type="text"
            name="date"
            onChange={(e) => handleFormChange(e, id)}
            value={formData[id]?.date || ''}
            // readOnly={!editingEmployee}
          />
        </label>
        <button type="submit">{editingEmployee ? 'Save' : 'Add Employee'}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.id}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  value={employee.firstName}
                  readOnly
                  onClick={() => handleUpdateClick(employee.id)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={employee.lastName}
                  readOnly
                  onClick={() => handleUpdateClick(employee.id)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={employee.email}
                  readOnly
                  onClick={() => handleUpdateClick(employee.id)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={employee.salary}
                  readOnly
                  onClick={() => handleUpdateClick(employee.id)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={employee.date}
                  readOnly
                  onClick={() => handleUpdateClick(employee.id)}
                />
              </td>
              <td>
                <button onClick={() => handleUpdateClick(employee.id)}>Update</button>
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
