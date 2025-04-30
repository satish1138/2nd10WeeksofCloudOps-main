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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file)); // For preview

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Set public image URL returned from backend
      setBook((prev) => ({ ...prev, cover: res.data.imageUrl }));
    } catch (err) {
      console.error("Image upload failed:", err);
      setError(true);
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

      {/* Optional: Paste image URL manually */}
      <input
        type="text"
        placeholder="Or paste image URL"
        name="cover"
        value={book.cover}
        onChange={handleChange}
      />

      {/* Upload image file */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {/* Preview uploaded image */}
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Book cover preview"
          style={{ width: "200px", marginTop: "10px" }}
        />
      )}

      <button onClick={handleClick}>Add</button>
      {error && <p style={{ color: "red" }}>Something went wrong!</p>}
      <br />
      <Link to="/">See all books</Link>
    </div>
  );
};

export default Add;
