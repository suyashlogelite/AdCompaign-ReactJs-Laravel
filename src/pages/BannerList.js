import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import axios from "axios";

const BannerList = () => {
  const [loading, setLoading] = useState(true);
  const [compaign, setCompaign] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/images");
        console.log(response);
        if (
          response.data &&
          response.data.data &&
          response.data.data.categoryData.length > 0
        ) {
          setCompaign(response.data.data.categoryData);
        } else {
          setCompaign([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    setTimeout(fetchData, 1000);
  }, []);

  const deleteCompaign = async (e, id) => {
    e.preventDefault();
    const thisClicked = e.currentTarget;
    const confirmation = window.confirm(
      "Are you sure you want to delete this campaign?"
    );

    if (confirmation) {
      thisClicked.innerText = "Deleting...";

      try {
        const response = await axios.delete(
          `http://127.0.0.1:8000/api/images/${id}/delete`
        );
        alert(response.data.message);
        thisClicked.closest("tr").remove();
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            alert(error.response.data.message);
            thisClicked.innerText = "Delete";
          }

          if (error.response.status === 500) {
            alert(error.response.data);
          }
        }
      }
    }
  };

  const statusUpdate = async (e, id, retryCount = 0) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/banner/${id}/status`
      );
      setCompaign((prevCompaign) => {
        const index = prevCompaign.findIndex((item) => item.id === id);
        if (index !== -1) {
          const updatedCompaign = [...prevCompaign];
          updatedCompaign[index].status = response.data.status;
          return updatedCompaign;
        } else {
          return prevCompaign;
        }
      });

      setLoading(true);
      const fetchData = await axios.get("http://127.0.0.1:8000/api/images");
      setCompaign(fetchData.data.data.categoryData);
      setLoading(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 429 && retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            statusUpdate(e, id, retryCount + 1);
          }, delay);
        } else {
          if (error.response.status === 404) {
            alert(error.response.data.message);
          }
          if (error.response.status === 500) {
            alert(error.response.data);
          }
        }
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Reverse the order of the compaign array
  compaign.reverse();

  // Map the compaign array to table rows
  var compaignDetails =
    compaign.length === 0 ? (
      <tr>
        <td colSpan="7">No Record</td>
      </tr>
    ) : (
      compaign.map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.title}</td>
          <td>{item.category}</td>
          <td>
            {item.status === "1" ? (
              <button
                onClick={(e) => statusUpdate(e, item.id)}
                className="btn btn-sm bg-success my-2 text-light"
              >
                ACTIVE
              </button>
            ) : (
              <button
                onClick={(e) => statusUpdate(e, item.id)}
                className="btn btn-sm bg-danger my-2 text-light"
              >
                INACTIVE
              </button>
            )}
          </td>
          <td>{item.created_at}</td>
          <td>{item.updated_at}</td>
          <td>
            <Link
              to={`/images/${item.id}/edit`}
              className="btn btn-success btn-sm me-2 fw-bold"
            >
              Edit
            </Link>
            <Link
              to={`/images/${item.id}/show`}
              className="btn btn-dark btn-sm fw-bold me-2"
            >
              Show
            </Link>
            <button
              type="button"
              onClick={(e) => deleteCompaign(e, item.id)}
              className="btn btn-danger btn-sm fw-bold"
            >
              Delete
            </button>
          </td>
        </tr>
      ))
    );

  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-11">
            <div className="card shadow">
              <div className="card-header bg-success text-white">
                <h4>
                  Compaign Details
                  <Link
                    to="/createBanner"
                    className="btn btn-primary text-white fw-bold float-end"
                  >
                    Add Compaign
                  </Link>
                </h4>
              </div>
              <div className="card-body">
                <table className="text-center table">
                  <thead className="table-success">
                    <tr>
                      <th>Id</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{compaignDetails}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerList;
