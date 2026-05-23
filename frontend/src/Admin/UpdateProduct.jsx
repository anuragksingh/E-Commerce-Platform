import { useEffect, useState } from "react";
import "../AdminStyles/UpdateProduct.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductDetails } from "../features/products/productSlice";
import {
  removeErrors,
  removeSuccess,
  updateProduct,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const { updateId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState([]);
  const [oldImage, setOldImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const { product } = useSelector((state) => state.product);
  const { success, error, loading } = useSelector((state) => state.admin);

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

  useEffect(() => {
    dispatch(getProductDetails(updateId));
  }, [dispatch, updateId]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category);
      setStock(product.stock);
      setOldImage(product.image);
    }
  }, [product]);

const handleImageChange = (e) => {

  const files = Array.from(e.target.files);

  setImage([]);
  setImagePreview([]);

  files.forEach((file) => {

    const reader = new FileReader();

    reader.onload = () => {

      if (reader.readyState === 2) {

        setImagePreview((old) => [
          ...old,
          reader.result,
        ]);

        setImage((old) => [
          ...old,
          reader.result,
        ]);
      }
    };

    reader.readAsDataURL(file);
  });
};

  const updateProductSubmit = (e) => {
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
    dispatch(updateProduct({ id: updateId, formData: myForm }));
  };

  useEffect(() => {
    if (success) {
      toast.success("Product Updated Successfully");
      dispatch(removeSuccess());
      navigate("/admin/products");
    }
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [dispatch, success, error]);

  return (
    <>
      <Navbar />
      <PageTitle title="Update Product" />
      <div className="update-product-wrapper">
        <h1 className="update-product-title">Update Product</h1>
        <form
          encType="multipart/form-data"
          className="update-product-form"
          onSubmit={updateProductSubmit}
        >
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            className="update-product-input "
            required
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="price">Product Price</label>
          <input
            type="number"
            className="update-product-input "
            required
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label htmlFor="description">Product Description</label>
          <textarea
            type="text"
            className="update-product-textarea "
            required
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <label htmlFor="category">Product Category</label>
          <select
            name="category"
            id="category"
            className="update-product-select"
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

          <label htmlFor="stock">Product Stock</label>
          <input
            type="number"
            className="update-product-input "
            required
            id="stock"
            name="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <label htmlFor="image">Product Images</label>
          <div className="update-prduct-file-wrapper">
            <input
              type="file"
              accept="image/"
              name="image"
              multiple
              className="update-product-file-input"
              onChange={handleImageChange}
            />
          </div>

          <div className="update-product-preview-wrapper">
            {imagePreview.map((img, index) => (
              <img
                src={img}
                alt="Product Preview"
                key={index}
                className="update-product-preview-image"
              />
            ))}
          </div>

          <div className="update-product-old-images-wrapper">
            {oldImage.map((img, index) => (
              <img
                src={img.url}
                alt="Product Preview"
                key={index}
                className="update-product-preview-image"
              />
            ))}
          </div>
          <button className="update-product-submit-btn">
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UpdateProduct;
