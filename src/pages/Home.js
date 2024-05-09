import React from "react";

const Home = () => {
  return (
    <div className="container-fluid">
      <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
        <div className="col-md-5 p-lg-5 mx-auto my-5">
          <h1 className="display-4 font-weight-normal">Punny headline</h1>
          <p className="lead font-weight-normal">
            And an even wittier subheading to boot. Jumpstart your marketing
            efforts with this example based on Apple's marketing pages.
          </p>
          <a className="btn btn-outline-secondary" href="#">
            Coming soon
          </a>
        </div>
        <div className="product-device box-shadow d-none d-md-block" />
        <div className="product-device product-device-2 box-shadow d-none d-md-block" />
      </div>
      <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
        <div>
          <div className="bg-dark mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
            <div className="my-3 py-3">
              <h2 className="display-5">Another headline</h2>
              <p className="lead">And an even wittier subheading.</p>
            </div>
            <div
              className="bg-light box-shadow mx-auto"
              style={{
                width: "80%",
                height: 300,
                borderRadius: "21px 21px 0 0",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
