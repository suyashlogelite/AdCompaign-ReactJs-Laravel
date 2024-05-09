import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const BannerEdit = () => {
  const [inputErrorList, setInputErrorList] = useState({});

  const { id } = useParams();
  const [banner, setBanner] = useState({
    title: "",
    category: "",
  });

  const [savedFile, setSavedFile] = useState([]);

  const [files, setFiles] = useState(
    Array.from({ length: 6 }, () => ({ file: null }))
  );

  const handleInput = (e) => {
    e.persist();
    setBanner({ ...banner, [e.target.name]: e.target.value });
  };

  const fileInputRefs = useRef(
    Array.from({ length: 6 }, () => React.createRef())
  );

  const handleFileChange = (index, e) => {
    const newFiles = [...files];
    newFiles[index].file = e.target.files[0];

    if (e.target.files.length > 0) {
      if (savedFile[`image${index + 1}`]) {
        URL.revokeObjectURL(savedFile[`image${index + 1}`]);
      }

      const newSavedFile = { ...savedFile };
      newSavedFile[`image${index + 1}`] = URL.createObjectURL(
        e.target.files[0]
      );

      setSavedFile(newSavedFile);
    }

    setFiles(newFiles);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/images/${id}/edit`
        );
        setBanner(res.data.banner);
        setSavedFile(res.data.images);

        // Initialize files state based on fetched images
        const initialFiles = Array.from({ length: 6 }, (_, index) => ({
          file: res.data.images[`image${index + 1}`] || null,
        }));
        setFiles(initialFiles);
      } catch (error) {
        handleErrors(error);
      }
    };
    fetchData();
  }, [id]);

  const handleErrors = (error) => {
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 404:
          alert(error.response.data.message);
          break;
        case 500:
          alert(error.response.data);
          break;
        default:
          console.error("An error occurred:", error);
      }
    } else {
      console.error("An error occurred:", error);
    }
  };

  const PLACEHOLDER_IMAGE_URL = "https://rb.gy/xz4imb";

  const deleteImage = (index) => {
    if (!Array.isArray(files)) {
      console.error("Files array is not properly initialized.");
      return;
    }

    const remainingImages = files.filter((file) => file.file !== null);
    const remainingImagesCount = remainingImages.length;

    // Check if the image being removed is the last non-null image
    if (remainingImagesCount === 1 && files[index].file !== null) {
      toast.error("You cannot remove the last remaining image.", {
        position: "top-right",
      });
      return;
    }

    let updatedFiles = [...files];
    updatedFiles[index].file = null;

    // Update the savedFile state to reflect the removed image
    let updatedSavedFile = { ...savedFile };
    delete updatedSavedFile[`image${index + 1}`]; // Remove the image URL from savedFile
    setFiles(updatedFiles);
    setSavedFile(updatedSavedFile);
  };

  const renderImage = (index) => {
    let src = savedFile ? savedFile[`image${index + 1}`] : null;
    if (!src) {
      src = "https://rb.gy/xz4imb";
    }
    return (
      <img
        src={src}
        className="card-img-top preview"
        alt={`Preview`}
        id={`preview${index}`}
      />
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", banner.title);
    data.append("category", banner.category);

    for (let i = 0; i < files.length; i++) {
      if (files[i].file) {
        data.append(`image${i + 1}`, files[i].file);
      }
    }

    axios
      .post(`http://127.0.0.1:8000/api/images/${id}/edit`, data)
      .then((res) => {
        toast.success(res.data.message, {
          position: "top-right",
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            setInputErrorList(error.response.data.errors);
          }
        }
      });
  };

  var error1 = inputErrorList.image1;
  var error2 = inputErrorList.image2;
  var error3 = inputErrorList.image3;
  var error4 = inputErrorList.image4;
  var error5 = inputErrorList.image5;
  var error6 = inputErrorList.image6;

  return (
    <div className="container-fluid">
      {/* Form side */}
      <div className="card mt-5 px-5 shadow border border-primary border-2">
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row mt-3">
              <div className="card border border-0 col-md-5">
                <div className="card-header shadow bg-primary fs-4 text-white">
                  Modify Your Campaign Here!
                </div>
                <div className="card-body shadow">
                  <div className="mb-3">
                    <label className="form-label fw-bold fs-5">
                      Compaign Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Your Title"
                      className="form-control"
                      id="title"
                      value={banner.title}
                      name="title"
                      onChange={handleInput}
                    />
                    <span className="text-danger">{inputErrorList.title}</span>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold fs-5">
                      Campaign Category
                    </label>
                    <select
                      name="category"
                      className="form-select"
                      onChange={handleInput}
                    >
                      <option disabled value={banner.category}>
                        Select Category
                      </option>
                      <option value={"Entertainment"}>Entertainment</option>
                      <option value={"Education"}>Education</option>
                      <option value={"Finance"}>Finance</option>
                      <option value={"Gaming"}>Gaming</option>
                      <option value={"Sports"}>Sports</option>
                    </select>
                    <span className="text-danger">
                      {inputErrorList.category}
                    </span>
                  </div>
                  <div className="m-0 p-0">
                    <button
                      type="submit"
                      className="btn btn-success form-control fw-bold"
                    >
                      Update
                    </button>
                    <ToastContainer />
                  </div>
                </div>
              </div>
              <div className="card col-md-7 border border-0">
                <div className="card-header shadow bg-danger fs-4 text-white">
                  Your Campaign!
                </div>
                <div className="card-body shadow border border-0">
                  <div className="row px-2">
                    <span className="text-danger" hidden>
                      {toast.error(inputErrorList.images, {
                        position: "top-right",
                      })}
                    </span>
                    {[...Array(6).keys()].map((index) => (
                      <div key={index} className="col-md-4 mb-3">
                        <div
                          className="card col-md-6"
                          style={{ width: "12rem" }}
                        >
                          {files[index].file && (
                            <button
                              type="button"
                              onClick={() => deleteImage(index)}
                              className="position-absolute top-0 end-0 btn-close border border-1 border-dark bg-danger"
                              aria-label="Close"
                            ></button>
                          )}
                          {renderImage(index)}
                          <input
                            type="file"
                            name={`image${index + 1}`}
                            className="btn btn-outline-dark form-control"
                            onChange={(e) => handleFileChange(index, e)}
                            ref={fileInputRefs.current[index]}
                          />
                          <label
                            htmlFor={`file${index}`}
                            className="btn btn-outline-dark btn-sm fw-bold"
                            onClick={() =>
                              fileInputRefs.current[index].current.click()
                            }
                          >
                            {files[index].file ? "Replace" : "Upload"}
                          </label>
                          {index === 0 && error1 && (
                            <span className="text-danger">
                              {inputErrorList.image1}
                            </span>
                          )}
                          {index === 1 && error2 && (
                            <span className="text-danger">
                              {inputErrorList.image2}
                            </span>
                          )}
                          {index === 2 && error3 && (
                            <span className="text-danger">
                              {inputErrorList.image3}
                            </span>
                          )}
                          {index === 3 && error4 && (
                            <span className="text-danger">
                              {inputErrorList.image4}
                            </span>
                          )}
                          {index === 4 && error5 && (
                            <span className="text-danger">
                              {inputErrorList.image5}
                            </span>
                          )}
                          {index === 5 && error6 && (
                            <span className="text-danger">
                              {inputErrorList.image6}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BannerEdit;
