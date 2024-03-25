import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Assets/CSS/agrilandssectione.css";
import Navbar from "../home/nav";
import Footernext from "../home/abouthefooter";

const AgrilandsSection = () => {
  const [agrilands, setAgrilands] = useState([]);
  const [filters, setFilters] = useState({
    landType: "",
    rentOrLease: "",
    location: "",
    rentOrLeasePrice: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedItems, setDisplayedItems] = useState(6);
  const [filterValues, setFilterValues] = useState({
    cropTypes: [],
    rentOrLeaseOptions: [],
  });
  useEffect(() => {
    const fetchAgrilands = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/lands`, {
          params: filters,
        });

        const landsArray = response.data;

        if (Array.isArray(landsArray)) {
          setAgrilands(landsArray);
        } else {
          console.error("Data received is not an array:", landsArray);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error fetching agrilands. Please try again later.");
        console.error("Error fetching agrilands:", error);
      }
    };

    fetchAgrilands();
  }, [filters]);

  useEffect(() => {
    const fetchFilterValues = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER}/api/filter-values`
        );
        const { cropTypes, rentOrLeaseOptions } = response.data;
        setFilterValues({ cropTypes, rentOrLeaseOptions });
      } catch (error) {
        console.error("Error fetching filter values:", error);
      }
    };

    fetchFilterValues();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleShowMore = () => {
    setDisplayedItems(displayedItems + 6);
  };

  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{
          marginTop: "8%",
          textAlign: "start",
          fontFamily: "Raleway,fantasy",
        }}
      >
        <h2
          style={{
            fontFamily: "Raleway,fantasy",
            color: "#137077",
            textAlign: "center",
          }}
        >
          Discover Cultivation Lands
        </h2>
        <br /> <br />
        <div className="filter-form">
          <label htmlFor="landType">Crop Types:</label>
          <select
            id="landType"
            onChange={(e) => handleFilterChange("landType", e.target.value)}
          >
            <option value="">All</option>
            {filterValues.cropTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <label htmlFor="rentOrLease">Rent, Sale or Lease:</label>
          <select
            id="rentOrLease"
            onChange={(e) => handleFilterChange("rentOrLease", e.target.value)}
          >
            <option value="">All</option>
            {filterValues.rentOrLeaseOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {loading && (
          <div class="dot-spinner">
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
          </div>
        )}
        {error && (
          <p
            style={{
              color: "#FF0000",
              textAlign: "center",
              marginTop: "10%",
              fontSize: "2em",
            }}
          >
            {error}
          </p>
        )}
        <div className="row">
          {agrilands.length === 0 && !loading && (
            <p
              style={{
                textAlign: "center",
                color: "#FF0000",
                marginTop: "10%",
                paddingBottom: "15%",
                fontSize: "2em",
              }}
            >
              {" "}
              Not found.
            </p>
          )}

          {agrilands.slice(0, displayedItems).map((land) => (
            <div key={land._id} className="col-md-4 mb-4">
              <div
                className="card"
                style={{ maxHeight: "600px", objectFit: "cover", width: "100%", boxShadow: "0 2px 4px 0 #137077", transition: "0.2s", }}
              >
                <Link
                  to={`/agriland/${land._id}`}
                  style={{ textDecoration: "none" }}
                >
                  {land.image && (
                    <div className="image-container" style={{height:'20vh'}}>
                      <img
                        src={land.image.url}
                        className="card-img-top"
                        alt="Land Image"
                        style={{
                          maxHeight: "200px",
                          objectFit: "cover",
                          cursor: "pointer",
                          width: "100%",
                          borderRadius: "8px 8px 0 0",
                        }}
                      />

                      <div className="overlay">
                        <Link
                          to={`/agriland/${land._id}`}
                          className="view-details-btn"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  )}
                </Link>
                <div className="card-body" style={{height:'30vh'}}>
                  <i
                    style={{
                      fontStyle: "italic",
                      color:
                        land.status === "Not Available" ? "#911b3b" : "#137077",
                    }}
                  >
                    {land.status}
                  </i>

                  <h5 className="card-title">{land.landType}</h5>
                  <p className="card-text">{land.rentOrLease}</p>
                  <p className="card-text">{land.location}</p>
                  <p className="card-text">Land Size: {land.landSize}</p>
                  <p className="card-text">Price: {land.rentOrLeasePrice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {agrilands.length > displayedItems && (
          <div className="text-center mt-4 p-5">
            <button className="btn btn-primary" onClick={handleShowMore}>
              Show More
            </button>
          </div>
        )}
      </div>
      <Footernext />
    </>
  );
};

export default AgrilandsSection;