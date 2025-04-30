import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

const Add = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    price: null,
    cover: "",
  });
  const [error, setError] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl); // for preview
      setBook((prev) => ({ ...prev, cover: imageUrl })); // store as string (not permanent)
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/books`, book);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Add New Book</h1>

      <input
        type="text"
        placeholder="Book title"
        name="title"
        onChange={handleChange}
      />
      <textarea
        rows={5}
        type="text"
        placeholder="Book description"
        name="desc"
        onChange={handleChange}
      />
      <input
        type="number"
        placeholder="Book price"
        name="price"
        onChange={handleChange}
      />

      {/* Optional: Allow paste URL directly */}
      <input
        type="text"
        placeholder="Or paste image URL"
        name="cover"
        onChange={handleChange}
      />

      {/* File upload input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {/* Image preview */}
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Book cover preview"
          style={{ width: "200px", marginTop: "10px" }}
        />
      )}

      <button onClick={handleClick}>Add</button>
      {error && "Something went wrong!"}
      <br />
      <Link to="/">See all books</Link>
    </div>
  );
};

export default Add;
