import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { RiDeleteBin3Line } from "react-icons/ri";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import {
  deleteProduct,
  fetchAdminProducts,
} from "../../redux/slices/adminProductSlice";
import { hiRes } from "../../utils/imageUrl";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  if (loading) return <p className="text-stone">Loading...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-1.5">Catalogue</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
            Product Management
          </h2>
        </div>
        <span className="text-sm text-stone shrink-0">
          {products.length} products
        </span>
      </div>

      <div className="bg-white border border-ink/10 rounded-2xl shadow-[var(--shadow-card)] overflow-x-auto hide-scrollbar">
        <table className="min-w-full text-left text-stone">
          <thead className="bg-sand/70 text-[11px] uppercase tracking-wider text-charcoal">
            <tr>
              <th className="py-3 px-5">Product</th>
              <th className="py-3 px-5">Price</th>
              <th className="py-3 px-5">SKU</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-ink/5 hover:bg-cream transition-colors"
                >
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={hiRes(product.images?.[0]?.url, 120)}
                        alt={product.name}
                        className="w-11 h-12 object-cover rounded-md bg-sand shrink-0"
                      />
                      <span className="font-medium text-ink">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-ink">${product.price}</td>
                  <td className="py-3 px-5 whitespace-nowrap">{product.sku}</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="inline-flex items-center gap-1.5 border border-ink/20 text-ink px-3 py-1.5 rounded-md text-sm hover:bg-ink hover:text-cream transition-colors"
                      >
                        <HiOutlinePencilSquare /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        aria-label="Delete product"
                        className="p-2 rounded-md text-stone hover:text-white hover:bg-danger transition-colors"
                      >
                        <RiDeleteBin3Line />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 px-5 text-center text-stone">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
