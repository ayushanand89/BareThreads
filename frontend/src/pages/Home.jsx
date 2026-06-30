import { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import Marquee from "../components/Layout/Marquee";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import EditorialStatement from "../components/Products/EditorialStatement";
import Lookbook from "../components/Products/Lookbook";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import { Reveal } from "../components/Common/Reveal";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";
import { axiosInstance } from "../utils/axios";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    // Fetch the product of specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear", 
        limit: 8,
      })
    );
    // Fetch the best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axiosInstance.get(`/products/best-seller`);
        setBestSellerProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching best seller product:", error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <Marquee />
      <GenderCollectionSection />
      <EditorialStatement />
      <NewArrivals />
      <Lookbook />

      {/* Best Sellers */}
      <Reveal className="text-center mt-8 mb-2">
        <div className="rule-gold w-12 mx-auto mb-4" />
        <p className="eyebrow mb-2">Most Loved</p>
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink">
          Best Seller
        </h2>
      </Reveal>
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center text-stone py-10">Loading best seller...</p>
      )}

      <div className="container mx-auto px-4 lg:px-6 py-12">
        <Reveal className="text-center mb-10">
          <div className="rule-gold w-12 mx-auto mb-4" />
          <p className="eyebrow mb-2">Editor's Picks</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink">
            Top Wear for Women
          </h2>
        </Reveal>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      {/* Featured Collection */}
      <FeaturedCollection />

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
};

export default Home;
