import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "./assets/css/UserDetails.css";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch all users when the component mounts
    axios
      .get("http://localhost:7001/api/users", { withCredentials: true })

      .then((response) => {
        const reversedUsers = response.data.reverse();
        setUsers(reversedUsers);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUpdateData({});
    setIsEditMode(true);
  };

  const handleUpdate = () => {
    if (!selectedUser || !isEditMode) {
      return;
    }
    const updatedFields = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      email: updateData.email,
      email: updateData.password,
    };

    axios
      .put(
        `http://localhost:7001/api/users/${selectedUser._id}`,
        updatedFields,
        { withCredentials: true }
      )
      .then((response) => {
        const updatedUsers = users.map((u) =>
          u._id === selectedUser._id ? response.data.user : u
        );
        setUsers(updatedUsers);
        setSelectedUser(null);
        setUpdateData({});
        setIsEditMode(false);
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  const handleDelete = (userId) => {
    axios
      .delete(`http://localhost:7001/api/users/${userId}`, {
        withCredentials: true,
      })
      .then((response) => {
        const updatedUsers = users.filter((u) => u._id !== userId);
        setUsers(updatedUsers);
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  const handleSearch = () => {
    // Implement the logic to fetch a user by ID using the search term (userId)
    axios
      .get(`http://localhost:7001/api/users/${searchTerm}`, {
        withCredentials: true,
      })
      .then((response) => {
        const user = response.data;
        if (user) {
          setSelectedUser(user);
          setIsEditMode(true);
        } else {
          // Handle case when user is not found
          console.error("User not found");
        }
      })
      .catch((error) => console.error("Error fetching user:", error));
  };

  const handleCreateUser = () => {
    axios
      .post("http://localhost:7001/api/admin/signup", updateData, {
        withCredentials: true,
      })
      .then((response) => {
        const updatedUsers = [];
        updatedUsers.push(response.data.user);
        for (let i = 0; i < users.length; i++) {
          updatedUsers.push(users[i]);
        }
        setUsers(updatedUsers);

        setIsCreateMode(false);
        setUpdateData({});
      })
      .catch((error) => console.error("Error creating user:", error));
  };

  return (
    <div
      className="user-details-container"
      style={{ fontFamily: "sans-serif", marginTop: "5%" }}
    >
      <h2 style={{ textAlign: "center", color: "#137077", marginTop: "8%" }}>
        All users Details
      </h2>

      <div className="search-bar-container" style={{ marginLeft: "46%" }}>
        <button
          style={{
            backgroundColor: "#137077",
            padding: "6px 8px",
            border: "none",
            cursor: "pointer",
            paddingLeft: "2%",
          }}
        >
          <input
            type="text"
            placeholder="Search by ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "90%", marginRight: "2%" }}
          />
          <FontAwesomeIcon
            icon={faSearch}
            style={{ color: "white" }}
            onClick={handleSearch}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </button>
        <button
          className="btn btn-danger"
          style={{
            backgroundColor: "#1E2C25",
            width: "40%",
            border: "none",
            cursor: "pointer",
            marginLeft: "25px",
          }}
          onClick={() => setIsCreateMode(true)}
        >
          Create User
        </button>
      </div>
      <div className="table-responsive">
        <table
          className="user-table table table-bordered table-hover"
          style={{ width: "75%", marginLeft: "13%" }}
        >
          <thead>
            <tr>
              <th>Number</th>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{users.length - index}</td>
                <td>{user._id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.timestamp}</td>
                <td>
                  <span>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleEdit(user)}
                      style={{
                        backgroundColor: "#137077",
                        marginLeft: "7%",
                        marginRight: "8%",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(user._id)}
                      style={{ backgroundColor: "#1E2C25" }}
                    >
                      Remove{" "}
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditMode && (
        <Modal show={isEditMode} onHide={() => setIsEditMode(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={updateData.firstName || selectedUser?.firstName || ""}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, firstName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={updateData.lastName || selectedUser?.lastName || ""}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, lastName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={updateData.email || selectedUser?.email || ""}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, email: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {isCreateMode && (
        <Modal show={isCreateMode} onHide={() => setIsCreateMode(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Create User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={updateData.firstName || ""}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, firstName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={updateData.lastName || ""}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, lastName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={updateData.email || ""}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>password:</Form.Label>
                <Form.Control
                  type="password"
                  value={updateData.password || ""}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, password: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleCreateUser}>
              Create User
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default UserDetails;
