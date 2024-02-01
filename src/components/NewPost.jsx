import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

console.log(faceapi.nets)


const NewPost = ({ image }) => {
  const { url, width, height } = image;
  const [faces, setFaces] = useState([]);
  const [friends, setFriends] = useState([]);
  const [ageGenderInfo, setAgeGenderInfo] = useState([]);

  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi.detectAllFaces(
      imgRef.current,new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
      canvasRef.current.width = imgRef.current.naturalWidth;
      canvasRef.current.height = imgRef.current.naturalHeight;
      faceapi.matchDimensions(canvasRef.current, { width, height });

      const resizedDetections = faceapi.resizeResults(detections, { width, height });

      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections); 
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

      const ageGenderData = resizedDetections.map(detection => ({
        age: detection.age,
        gender: detection.gender,
        genderProbability: detection.genderProbability
      }));
      setAgeGenderInfo(ageGenderData); 

      console.log(ageGenderData);
  };


  /*const enter = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    faces.map((face) => ctx.strokeRect(...face));
  };*/

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        faceapi.nets.ageGenderNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };

    imgRef.current && loadModels();
  }, []);

  const addFriend = (e) => {
    setFriends((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  console.log(friends);
  return (
    <div className="container">
      <div className="left" style={{ width, height }}>
        <div className="image-container" style={{ width: width, height: height }}>
          <img ref={imgRef} crossOrigin="anonymous" src={url} alt="" />
          <canvas ref={canvasRef} />
        </div>
        {faces.map((face, i) => (
          <input
            name={`input${i}`}
            style={{ left: face[0], top: face[1] + face[3] + 5 }}
            placeholder="Tag a friend"
            key={i}
            className="friendInput"
            onChange={addFriend}
          />
        ))}
      </div>
      <div className="right">
        <h1>Heres the ai's guess:</h1>
        {/* Display Age and Gender Info */}
        {ageGenderInfo.map((info, index) => (
          <div key={index}>
            <p>Age: {Math.round(info.age)}</p>
            <p>Gender: {info.gender} </p>
          </div>
        ))}
      </div>
    </div>
  );

        };
export default NewPost;