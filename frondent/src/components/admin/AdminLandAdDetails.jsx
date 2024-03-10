import React, { useState, useEffect } from "react";
import axios from "axios";
import "./assets/css/AdminLandDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const AdminLandDetails = () => {
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [updateData, setUpdateData] = useState({ imageFile: null });
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [selectedLandId, setSelectedLandId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get("http://localhost:7001/api/landsadmin", { withCredentials: true })
      .then((response) => {
        const reversedLands = response.data.reverse();
        setLands(reversedLands);
      })
      .catch((error) => console.error("Error fetching land data:", error));
  }, []);

  const handleEdit = (land) => {
    setSelectedLand(land);
    setUpdateData({ imageFile: null });
    setIsEditMode(true);
  };

  const handleUpdate = async () => {
    if (!selectedLand || !isEditMode) {
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(updateData).forEach(([key, value]) => {
        if (key !== "imageFile") {
          formData.append(key, value);
        }
      });

      if (updateData.imageFile) {
        formData.append("image", updateData.imageFile);
      }

      const response = await axios.put(
        `http://localhost:7001/api/lands/${selectedLand._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedLands = lands.map((l) =>
        l._id === selectedLand._id ? response.data : l
      );
      setLands(updatedLands);
      setSelectedLand(null);
      setUpdateData({ imageFile: null });
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating land:", error);
    }
  };

  const handleDelete = async (landId) => {
    try {
      const response = await axios.patch(
        `http://localhost:7001/api/lands/${landId}`,
        { withCredentials: true }
      );
      const updatedLands = lands.map((l) =>
        l._id === landId ? response.data : l
      );
      setLands(updatedLands);
      setDeleteConfirmationId(null);
    } catch (error) {
      console.error("Error soft deleting land:", error);
    }
  };

  const filteredLands = lands.filter((land) =>
    land._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredLands.length / itemsPerPage);

  // Function to handle next page
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // Function to handle previous page
  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLands.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpenPopup = (landId) => {
    setSelectedLandId(landId);
  };

  const handleClosePopup = () => {
    setSelectedLandId(null);
  };

  const handleCancel = () => {
    setSelectedLand(null);
    setUpdateData({ imageFile: null });
    setIsEditMode(false);
  };

  const renderPaginationButtons = () => {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' ,marginLeft:'75%'}}>
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span style={{ margin: '0 10px' }}>{currentPage} / {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    );
  };

  return (
    <div className="admin-land-details">
      <h2 style={{ textAlign: "center", color: "#137077", marginTop: "7%" }}>
        All Land Details
      </h2>
      <div className="search-bar-container" style={{ marginLeft: "67%" }}>
        <button
          style={{
            backgroundColor: "#137077",
            border: "none",
            cursor: "pointer",
          }}
        >
          <input
            type="text"
            placeholder="Search by ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginLeft: "10%" }}
          />
          <FontAwesomeIcon
            icon={faSearch}
            style={{ color: "white", paddingLeft: "10px" }}
          />
        </button>
        <a href="/admin/CreateLand">
          <button
            style={{
              backgroundColor: "#1E2C25",
              color: "white",
              padding: "7px 35px",
              border: "none",
              cursor: "pointer",
              marginLeft: "15px",
              marginTop: "33%",
            }}
          >
            Create
          </button>
        </a>
      </div>
      
      <table className="land-details-table" style={{ overflow: "auto", maxHeight: "100px" }}>
        <thead>
          <tr>
            <th style={{ width: "1%" }}>Number</th>
            <th style={{ width: "1%" }}>ID</th>
            <th>Crop Types</th>
            <th>RentOrLease</th>
            <th>Land Size</th>
            <th>Image</th>
            <th>Status</th>
            <th>Pay</th>
            <th>Actions</th>
            <th>More</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((land, index) => (
            <React.Fragment key={land._id}>
              <tr>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{land._id}</td>
                <td>{land.landType}</td>
                <td>{land.rentOrLease}</td>
                <td>{land.landSize}</td>
                <td className="img">
                  {land.image && <img src={land.image.url} alt="Land" />}
                </td>
                <td>{land.status}</td>
                <td>{land.Pay}</td>
                <td>
                  {!isEditMode && (
                    <div style={{ display: "inline" }}>
                      <button
                        className="btn"
                        onClick={() => handleEdit(land)}
                        style={{
                          backgroundColor: land.ispost ? "#167370" : "#8ECBC9",
                          padding: "5px 5px",
                          border: "none",
                          cursor: "pointer",
                          width: "100px",
                          display: "inline",
                        }}
                      >
                        {land.ispost ? "Post" : "Not Post"}
                      </button>
                      {land.ispost && (
                        <button
                          className="btn"
                          onClick={() => setDeleteConfirmationId(land._id)}
                          style={{
                            padding: "5px 5px",
                            border: "none",
                            cursor: "pointer",
                            width: "100px",
                            display: "inline",
                            background: "red",
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td>
                  <button
                    className="btn"
                    onClick={() => handleOpenPopup(land._id)}
                    style={{
                      padding: "5px 26px",
                      border: "none",
                      cursor: "pointer",
                      background: "black",
                    }}
                  >
                    More
                  </button>
                </td>
              </tr>
              {selectedLandId === land._id && (
                <tr>
                  <td colSpan="11">
                    <div
                      className="popup-container"
                      style={{
                        display: "block",
                        position: "fixed",
                        zIndex: "1",
                        left: "0",
                        top: "0",
                        width: "100%",
                        height: "100%",
                        overflow: "auto",
                        backgroundColor: "rgba(0,0,0,0.4)",
                      }}
                    >
                      <div
                        className="popup"
                        style={{
                          margin: "15% auto",
                          padding: "20px",
                          border: "1px solid #888",
                          width: "27%",
                          height: "100vh",
                        }}
                      >
                        <div className="content" style={{ width: "300vw" }}>
                          <span
                            className="close"
                            style={{
                              color: "black",
                              fontSize: "3em",
                              float: "right",
                            }}
                            onClick={handleClosePopup}
                          >
                            <i
                              className="fa fa-window-close"
                              aria-hidden="true"
                            ></i>
                          </span>
                          <p style={{ marginTop: "10px" }}>
                            <strong>Price:</strong> {land.rentOrLeasePrice}
                          </p>
                          <p>
                            <strong>Land Location:</strong> {land.location}
                          </p>
                          <p>
                            <strong>Water Details:</strong> {land.waterDetails}
                          </p>
                          <p>
                            <strong>Electricity Status:</strong>{" "}
                            {land.electricityStatus}
                          </p>
                          <p>
                            <strong>Name:</strong> {land.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {land.email}
                          </p>
                          <p>
                            <strong>Phone Numbers:</strong> {land.phoneNumbers}
                          </p>
                          <p>
                            <strong>Other Numbers:</strong> {land.OtherNumbers}
                          </p>
                          <p>
                            <strong>Address:</strong> {land.address}
                          </p>
                          <p>{land.timestamps}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {deleteConfirmationId && (
        <div className="popup-container">
          <div className="popup" style={{ width: "30%", padding: "2%" }}>
            <p style={{ fontSize: "1.5em" }}>
              Are you sure you want to{" "}
              <span style={{ color: "#ff5252", display: "inline" }}>
                Remove{" "}
              </span>{" "}
              this land?
            </p>
            <div
              style={{
                display: "flex",
                padding: "5px",
                marginLeft: "20%",
                marginTop: "5%",
              }}
            >
              <p
                onClick={() => handleDelete(deleteConfirmationId)}
                className="btn"
              >
                Yes
              </p>
              <p
                onClick={() => setDeleteConfirmationId(null)}
                className="btn"
                style={{ background: "black", marginLeft: "25%" }}
              >
                No
              </p>
            </div>
          </div>
        </div>
      )}

      {isEditMode && (
        <div className="popup-container">
          <div className="popup">
            <form>
              <span
                className="close"
                style={{ fontSize: "3em", float: "right" }}
                onClick={handleCancel}
              >
                <i className="fa fa-window-close" aria-hidden="true"></i>
              </span>
              <h2>Post</h2>
              <div className="form-row editeform">
                <label htmlFor="otherDetails">Description:</label>
                <input
                  type="text"
                  id="otherDetails"
                  className="form-input"
                  value={
                    updateData.otherDetails || selectedLand?.otherDetails || ""
                  }
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      otherDetails: e.target.value,
                    })
                  }
                  style={{ height: "7vh" }}
                />
              </div>
              <div className="form-row editeform">
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  className="form-select"
                  value={updateData.status || selectedLand?.status || ""}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, status: e.target.value })
                  }
                  style={{ height: "7vh" }}
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
              <div
                className="form-row editeform"
                style={{ textAlign: "right" }}
              >
                <label htmlFor="isPost">Is Post:</label>
                <input
                  type="checkbox"
                  id="isPost"
                  className="form-checkbox"
                  checked={updateData.ispost || selectedLand?.ispost || false}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, ispost: e.target.checked })
                  }
                  style={{ verticalAlign: "middle" }}
                />
              </div>
              <button
                onClick={handleUpdate}
                style={{
                  display: "block",
                  margin: "10px auto 0",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {renderPaginationButtons()}
    </div>
  );
};

export default AdminLandDetails;
