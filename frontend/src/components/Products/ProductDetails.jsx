import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import ProductReviews from "./ProductReviews";
import StarRating from "../Common/StarRating";
import Skeleton from "../Common/Skeletons";
import { Reveal, StaggerGroup, StaggerItem } from "../Common/Reveal";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import {
  fetchProductsByDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { hiRes } from "../../utils/imageUrl";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const imageWrapRef = useRef(null);

  // Reset the loaded flag whenever the displayed image changes so the
  // shimmer loader shows until the new (high-res) image is ready.
  useEffect(() => {
    setImgLoaded(false);
  }, [mainImage]);

  const handleZoomMove = (e) => {
    const el = imageWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ active: true, x, y });
  };

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductsByDetails({ id: productFetchId }));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    } else if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color", {
        duration: 1000,
      });
      return;
    }
    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to Cart!", {
          duration: 1000,
        });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-1/2 aspect-[3/4]" />
          <div className="md:w-1/2 space-y-4 pt-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-full mt-8" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-danger font-medium">Couldn't load product</p>
        <p className="text-stone text-sm mt-1">{error}</p>
      </div>
    );
  }

  const hasDiscount =
    selectedProduct?.discountPrice &&
    selectedProduct.discountPrice < selectedProduct.price;

  return (
    <div className="p-4 lg:p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-6 lg:p-10 rounded-2xl border border-ink/10 shadow-[var(--shadow-card)]">
          <div className="flex flex-col md:flex-row">
            {/* Left Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={hiRes(image.url, 240)}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                    mainImage === image.url ? "border-ink" : "border-ink/10 hover:border-ink/30"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Main Image — cursor-following magnifier zoom */}
            <Reveal direction="up" className="md:w-1/2">
              <div
                ref={imageWrapRef}
                onMouseMove={handleZoomMove}
                onMouseEnter={handleZoomMove}
                onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
                className="relative mb-4 overflow-hidden rounded-xl clip-card bg-sand cursor-crosshair aspect-[3/4] shadow-[var(--shadow-card)]"
              >
                {/* Shimmer loader while the new image downloads */}
                {!imgLoaded && (
                  <div className="absolute inset-0 skeleton z-10" />
                )}
                <img
                  key={mainImage}
                  src={hiRes(mainImage, 1600)}
                  alt="Main Product"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgLoaded(true)}
                  className={`w-full h-full object-cover transition-[transform,opacity] duration-300 ease-out ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    transform: zoom.active ? "scale(2)" : "none",
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                  }}
                />
                {/* zoom hint */}
                <span
                  className={`hidden lg:block absolute bottom-3 right-3 text-[10px] uppercase tracking-wider bg-ink/70 text-cream px-2.5 py-1 rounded-full transition-opacity duration-300 ${
                    zoom.active ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Hover to zoom
                </span>
              </div>
            </Reveal>

            {/* Mobile Thumbnail */}
            <div className="md:hidden flex overflow-x-auto space-x-4 mb-4 hide-scrollbar">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={hiRes(image.url, 240)}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 flex-shrink-0 object-cover rounded-lg cursor-pointer border-2 ${
                    mainImage === image.url ? "border-ink" : "border-ink/10"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Right Side */}
            <StaggerGroup className="md:w-1/2 md:ml-10" stagger={0.07}>
              <StaggerItem>
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-3">
                  {selectedProduct.name}
                </h1>

                {/* Rating */}
                {selectedProduct.numReviews > 0 && (
                  <div className="mb-3">
                    <StarRating
                      value={selectedProduct.rating}
                      count={selectedProduct.numReviews}
                      showValue
                    />
                  </div>
                )}
              </StaggerItem>

              <StaggerItem className="flex items-center gap-3 mb-6">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl font-semibold text-ink">
                      ${selectedProduct.discountPrice}
                    </span>
                    <span className="text-lg text-stone line-through">
                      ${selectedProduct.price}
                    </span>
                    <span className="bg-accent-soft text-accent text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full">
                      Sale
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-semibold text-ink">
                    ${selectedProduct.price}
                  </span>
                )}
              </StaggerItem>

              {/* Color Buttons */}
              <StaggerItem className="mb-5">
                <p className="label-field">Color</p>
                <div className="flex gap-2 mt-1">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      aria-label={color}
                      className={`w-9 h-9 rounded-full transition-all duration-200 hover:scale-110 ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-ink scale-110"
                          : "ring-1 ring-ink/20"
                      }`}
                      style={{
                        backgroundColor: color.toLocaleLowerCase(),
                        filter: "brightness(0.7)",
                      }}
                    ></button>
                  ))}
                </div>
              </StaggerItem>

              {/* Size Buttons */}
              <StaggerItem className="mb-5">
                <p className="label-field">Size</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                        selectedSize === size
                          ? "bg-ink text-cream border-ink"
                          : "bg-white text-ink border-ink/20 hover:border-ink"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </StaggerItem>

              {/* Quantity Selector */}
              <StaggerItem className="mb-7">
                <p className="label-field">Quantity</p>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    aria-label="Decrease quantity"
                    className="w-9 h-9 border border-ink/20 rounded-md text-lg hover:bg-ink hover:text-cream transition-colors"
                  >
                    -
                  </button>
                  <span className="text-base font-medium w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    aria-label="Increase quantity"
                    className="w-9 h-9 border border-ink/20 rounded-md text-lg hover:bg-ink hover:text-cream transition-colors"
                  >
                    +
                  </button>
                </div>
              </StaggerItem>

              {/* Add to Cart Button */}
              <StaggerItem>
                <button
                  onClick={handleAddToCart}
                  disabled={isButtonDisabled}
                  className="btn-primary w-full"
                >
                  {isButtonDisabled ? "Adding..." : "Add to Cart"}
                </button>
              </StaggerItem>

              {/* Description */}
              <StaggerItem className="mt-10">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-stone mb-3">
                  Characteristics
                </h3>
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-ink/5">
                    <tr>
                      <td className="py-2 text-stone">Brand</td>
                      <td className="py-2 text-ink">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-stone">Material</td>
                      <td className="py-2 text-ink">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </StaggerItem>
            </StaggerGroup>
          </div>

          {/* Reviews — only on the dedicated product page, not the embedded
              home best-seller showcase */}
          {!productId && <ProductReviews productId={productFetchId} />}

          {/* You may also like section */}
          <div className="mt-20">
            <Reveal className="text-center mb-10">
              <div className="rule-gold w-12 mx-auto mb-4" />
              <p className="eyebrow mb-2">You May Also Like</p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">
                Complete the Look
              </h2>
            </Reveal>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
