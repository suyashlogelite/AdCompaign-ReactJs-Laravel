import React, { useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BannerCreate = () => {
  const [inputErrorList, setInputErrorList] = useState({});

  const [banner, setBanner] = useState({
    title: "",
    category: "",
  });

  const [files, setFiles] = useState(Array.from({ length: 6 }, () => null));

  const handleInput = (e) => {
    e.persist();
    setBanner({ ...banner, [e.target.name]: e.target.value });
  };

  const fileInputRefs = useRef(
    Array.from({ length: 6 }, () => React.createRef())
  );

  const handleFileChange = (index, e) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };

  const saveBanner = (e) => {
    e.preventDefault();

    const hasImageSelected = files.some((file) => file !== null);

    if (!hasImageSelected) {
      setInputErrorList((prevState) => ({
        ...prevState,
        images: "Please select at least one image.",
      }));
    }

    const data = new FormData();
    data.append("title", banner.title);
    data.append("category", banner.category);
    files.forEach((file, index) => {
      if (file) {
        data.append(`image${index + 1}`, file);
      }
    });

    axios
      .post(`http://127.0.0.1:8000/api/images`, data)
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

  const deleteImage = (index) => {
    const remainingImages = files.filter((file) => file !== null);
    const remainingImagesCount = remainingImages.length;

    if (remainingImagesCount === 1 && remainingImages[0] === files[index]) {
      toast.error("You cannot remove the last remaining image.", {
        position: "top-right",
      });
      return;
    }

    let updatedFiles = [...files];
    let Image = document.getElementById(`preview${index}`).getAttribute("src");

    if (Image !== "https://rb.gy/xz4imb") {
      updatedFiles[index] = null;
      setTimeout(() => {
        setFiles(updatedFiles);
      });
      document
        .getElementById(`preview${index}`)
        .setAttribute("src", "https://rb.gy/xz4imb");
    }
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
          <form onSubmit={saveBanner} encType="multipart/form-data">
            <div className="row mt-3">
              <div className="card border border-0 col-md-5">
                <div className="card-header shadow bg-primary fs-4 text-white">
                  Create Your Campaign Here!
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
                      value={banner.category}
                    >
                      <option disabled value="">
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
                      Submit
                    </button>
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
                    {error1 ? (
                      <span className="text-danger">
                        {inputErrorList.image1}
                      </span>
                    ) : error2 ? (
                      <span className="text-danger">
                        {inputErrorList.image2}
                      </span>
                    ) : error3 ? (
                      <span className="text-danger">
                        {inputErrorList.image3}
                      </span>
                    ) : error4 ? (
                      <span className="text-danger">
                        {inputErrorList.image4}
                      </span>
                    ) : error5 ? (
                      <span className="text-danger">
                        {inputErrorList.image5}
                      </span>
                    ) : error6 ? (
                      <span className="text-danger">
                        {inputErrorList.image6}
                      </span>
                    ) : (
                      <span></span>
                    )}
                    {files.map((file, index) => (
                      <div key={index} className="col-md-4 mb-3">
                        <div
                          className="card col-md-6"
                          style={{ width: "12rem" }}
                        >
                          {file && (
                            <button
                              type="button"
                              onClick={() => deleteImage(index)}
                              className="position-absolute top-0 end-0 btn-close border border-1 border-dark bg-danger"
                              aria-label="Close"
                            ></button>
                          )}

                          {file ? (
                            <img
                              className="card-img-top preview"
                              src={URL.createObjectURL(file)}
                              id={`preview${index}`}
                              alt={`Preview`}
                            />
                          ) : (
                            <img
                              className="card-img-top preview"
                              src={"https://rb.gy/xz4imb"}
                              id={`preview${index}`}
                              alt={`Preview`}
                            />
                          )}
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
                            {file ? "Replace" : "Upload"}
                          </label>
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
      <ToastContainer />
    </div>
  );
};

export default BannerCreate;
