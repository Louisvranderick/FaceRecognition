import { useEffect, useState } from "react";
import "./app.css";
import Navbar from "./components/Navbar";
import NewPost from "./components/NewPost";

import "./app.css"; // Import the CSS file for styling

import React from "react";

function App() {
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    const getImage = () => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage({
          url: img.src,
          width: img.width,
          height: img.height,
        });
      };
    };

    file && getImage();
  }, [file]);

  const handleUploadClick = () => {
    document.getElementById("file").click();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  console.log(image);

  return (
    <div>
      <Navbar />
      {image ? (
        <NewPost image={image} />
      ) : (
        <div className="newPostCard">
          <div className="addPost">
            <div className="postForm">
              <label htmlFor="file">
                <div className="uploadContainer" onClick={handleUploadClick}>
                  <h1>Upload a photo</h1>
                </div>
                <input
                  onChange={handleFileChange}
                  id="file"
                  style={{ display: "none" }}
                  type="file"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
