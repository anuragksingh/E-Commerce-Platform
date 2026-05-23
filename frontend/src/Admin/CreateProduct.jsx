import { useEffect, useState } from "react";
import "../AdminStyles/CreateProduct.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const { success, loading, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const categories = [
    "Electronics",
    "Fashion",
    "Men's Clothing",
    "Women's Clothing",
    "Kids & Baby",
    "Footwear",
    "Watches",
    "Jewelry",
    "Beauty & Personal Care",
    "Health & Wellness",
    "Groceries",
    "Home & Kitchen",
    "Furniture",
    "Home Decor",
    "Appliances",
    "Mobile Phones",
    "Laptops & Computers",
    "Gaming",
    "Books",
    "Stationery",
    "Sports & Fitness",
    "Toys & Games",
    "Automotive",
    "Tools & Hardware",
    "Pet Supplies",
    "Office Supplies",
    "Garden & Outdoor",
    "Music & Instruments",
    "Movies & Entertainment",
    "Baby Products",
    "Travel Accessories",
    "Bags & Luggage",
    "Food & Beverages",
    "Digital Products",
    "Software",
    "Gift Items",
    "Handmade Products",
    "Industrial Supplies",
    "Medical Supplies",
    "Accessories",
  ];

  const createProductSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);
    image.forEach((img) => {
      myForm.append("image", img);
    });
    dispatch(createProduct(myForm));
  };

  const createProductImage = (e) => {
    const files = Array.from(e.target.files);

    setImage([]);
    setImagePreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);

      setImage((old) => [...old, file]);
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Product Created Successfully");

      dispatch(removeSuccess());

      setName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImage([]);
      setImagePreview([]);
      setStock("");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [success, error, dispatch, navigate]);

  return (
    <>
      <Navbar />
      <PageTitle title="Create Product" />
      <div className="create-product-container">
        <h1 className="form-title">Create Product</h1>
        <form
          encType="multipart/form-data"
          className="product-form"
          onSubmit={createProductSubmit}
        >
          <input
            type="text"
            placeholder="Enter Product Name"
            className="form-input"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Enter Product Price"
            className="form-input"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            name="price"
          />
          <input
            type="text"
            placeholder="Enter Product Description"
            className="form-input"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select
            className="form-select"
            required
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a Category</option>
            {categories.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Enter Product Stock"
            className="form-input"
            name="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <div className="file-input-container">
            <input
              type="file"
              accept="image/*"
              className="form-input-file"
              multiple
              name="image"
              required
              onChange={createProductImage}
            />
          </div>
          <div className="image-preview-container">
            {imagePreview.map((img, index) => (
              <img
                src={img}
                alt="Product Preview"
                className="image-preview"
                key={index}
              />
            ))}
          </div>
          <button className="submit-btn">
            {loading ? "Creating Product..." : "Create"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateProduct;
