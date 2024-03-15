import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./App.module.css";

function ProductList() {
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(30);
  const observer = useRef();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const listInnerRef = useRef();
  const pageRef = useRef(1);

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [productData, searchTerm, priceFilter, categoryFilter, sortBy, sortOrder]);

  useEffect(() => {
    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });
    if (observer.current) {
      observer.current.observe(document.getElementById("observer"));
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [filteredData]);

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      const remainingImages = filteredData.length - imagesLoaded;
      const nextBatchSize = Math.min(30, remainingImages);
      setImagesLoaded((prev) => prev + nextBatchSize);
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products");
      const data = await response.json();
      setProductData(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const applyFilters = () => {
    let filteredProducts = productData.filter((product) => {
      let isValid = true;
      if (
        searchTerm &&
        !product.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        isValid = false;
      }
      if (priceFilter && parseFloat(product.price) > parseFloat(priceFilter)) {
        isValid = false;
      }
      if (categoryFilter && product.category !== categoryFilter) {
        isValid = false;
      }
      return isValid;
    });

    if (sortBy === "price") {
      filteredProducts.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
    } else if (sortBy === "title") {
      filteredProducts.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });
    }

    setFilteredData(filteredProducts);
  };

  const handleSortChange = (e) => {
    const { value } = e.target;
    const [sortByValue, sortOrderValue] = value.split("-");
    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleScroll = () => {
    if (
      Math.ceil(window.innerHeight + document.documentElement.scrollTop) ===
      document.documentElement.offsetHeight
    ) {
      fetchMoreItems();
    }
  };

  const fetchMoreItems = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const skip = productData.length;
      const response = await fetch(
        `https://dummyjson.com/products?page=${nextPage}&limit=30&skip=${skip}`
      );
      const data = await response.json();
      setProductData((prevProducts) => [...prevProducts, ...data.products]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="blog-contain card text-center">
      <div className={`${styles.BackGround} ${styles.container} card-body`}>
        <h1 className={`${styles.heading}`}>PRODUCT LIST</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Price"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          />
          {/* <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Select Category</option>
            {productData.map((product) => (
              <option key={product.id} value={product.category}>
                {product.category}
              </option>
            ))}
          </select> */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Select Category</option>
            {[...new Set(productData.map((product) => product.category))].map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )
            )}
          </select>

          <select value={`${sortBy}-${sortOrder}`} onChange={handleSortChange}>
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Title: A to Z</option>
            <option value="title-desc">Title: Z to A</option>
          </select>
        </div>
        <div className={`row`}>
          {filteredData.slice(0, imagesLoaded).map((product) => (
            <div
              key={product.id}
              className={`text-white col-3 position-relative ${styles.detailbox}`}
            >
              <Link to={`/product/${product.id}`}>
                <img
                  className={`${styles.imagetag} m-3`}
                  src={product.images[0]}
                  alt={product.title}
                />
              </Link>
              <h1>{product.title}</h1>
              <h1>{product.price}</h1>
              <h1>{product.category}</h1>
            </div>
          ))}
        </div>
        <div id="observer"></div>
      </div>
    </div>
  );
}
export default ProductList;
