import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import image from "../images/logo192.png";

export const Imagelist = () => {
  let { id } = useParams();
  const [images, setImages] = useState({});
  const [banner, setBanner] = useState({});

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/images/${id}/show`)
      .then((res) => {
        setImages(res.data.images);
        setBanner(res.data.banner);
      })
      .catch((error) => {
        handleErrors(error);
      });
  }, [id]);

  const handleErrors = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        alert("Image not found.");
      } else if (error.response.status === 500) {
        alert("Server error. Please try again later.");
      }
    } else {
      alert("Network error. Please check your connection.");
    }
  };

  const renderImage = (key) => {
    const src = images[key] || image;
    return <img src={src} className="imageShow" alt="..." />;
  };

  return (
    <>
      <div class="display-6 text-center text-danger fw-bold card shadow-lg my-2 mx-5">
        Advertisements - Campaigns
      </div>
      <div class="container px-5">
        <div class="row p-3 mt-3 mx-4">
          <div class="col-md-5 card p-3 bg-info ms-5 me-5">
            <div>
              <label className="text-dark fw-bold mb-2">Campaign Name</label>
              <input className="form-control" defaultValue={banner.title} />
            </div>
          </div>
          <div class="col-md-5 card p-3 bg-info ms-5">
            <div>
              <label className="text-dark fw-bold mb-2">
                Campaign Category
              </label>
              <input className="form-control" defaultValue={banner.category} />
            </div>
          </div>
        </div>
        <div class="row mt-2 text-center">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              class="col-md-4 card shadow d-flex justify-content-center flex-row"
            >
              {renderImage(`image${index}`)}
            </div>
          ))}
        </div>
        <div className="row mt-3 text-center">
          {[4, 5, 6].map((index) => (
            <div
              key={index}
              class="col-md-4 card shadow d-flex justify-content-center flex-row"
            >
              {renderImage(`image${index}`)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
