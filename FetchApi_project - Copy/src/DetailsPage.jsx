// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";

// function ProductDetails() {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   };
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetchProductDetails(productId);
//   }, [productId]);

//   const fetchProductDetails = async (id) => {
//     try {
//       const response = await fetch(`https://dummyjson.com/products/${id}`);
//       const data = await response.json();
//       setProduct(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   if (!product) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="details">
//       <h1>{product.title}</h1>
//       <Slider {...settings}>
//         <p>Description: {product.description}</p>
//         <p>Price: {product.price}</p>
//         <p>discountPercentage:{product.discountPercentage}</p>
//         <p>rating:{product.rating}</p>
//         <p>stock:{product.stock}</p>
//         <p>brand:{product.brand}</p>
//         <p>category:{product.category}</p>
//       </Slider>
//     </div>
//   );
// }

// export default ProductDetails;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Detail.module.css";

function ProductDetails() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProductDetails(productId);
  }, [productId]);

  const fetchProductDetails = async (id) => {
    try {
      const response = await fetch(`https:dummyjson.com/products/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.details}>
      <div className={styles.Sliderimg}>
        {product?.images?.length > 1 ? (
          <Slider {...settings}>
            {product.images.map((image, index) => (
              <div key={index}>
                <img className="img" src={image} alt={`Image ${index}`} />
                {product.title}
                {product.price}
              </div>
            ))}
          </Slider>
        ) : (
          <>
            <img className="img" src={product?.images[0]} alt={`Image ${1}`} />
          </>
        )}
      </div>
      <div className={styles.DesName}>
        <h1>{product.title}</h1>

        <p>Description: {product.description}</p>
        <p>Price: {product.price}</p>
        <p>discountPercentage:{product.discountPercentage}</p>
        <p>rating:{product.rating}</p>
        <p>stock:{product.stock}</p>
        <p>brand:{product.brand}</p>
        <p>category:{product.category}</p>
      </div>
    </div>
  );
}

export default ProductDetails;
