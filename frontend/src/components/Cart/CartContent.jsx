import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";
import { hiRes } from "../../utils/imageUrl";

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div className="space-y-4">
      {cart.products.map((product, i) => (
        <div
          key={`${product.productId}-${product.size}-${product.color}`}
          className="group flex gap-4 p-3 rounded-xl border border-ink/10 bg-white hover:border-ink/20 hover:shadow-[var(--shadow-card)] transition-all duration-300 animate-fade-up"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="relative w-20 h-24 shrink-0 overflow-hidden rounded-lg bg-sand">
            <img
              src={hiRes(product.image, 240)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-ink leading-snug line-clamp-2 pr-1">
                {product.name}
              </h3>
              <button
                onClick={() =>
                  handleRemoveFromCart(
                    product.productId,
                    product.size,
                    product.color
                  )
                }
                aria-label="Remove item"
                className="shrink-0 text-stone hover:text-danger transition-all hover:scale-110 active:scale-90"
              >
                <RiDeleteBin3Line className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] text-stone bg-sand px-2 py-0.5 rounded-full">
                {product.size}
              </span>
              <span className="text-[11px] text-stone bg-sand px-2 py-0.5 rounded-full">
                {product.color}
              </span>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2">
              {/* Quantity stepper */}
              <div className="inline-flex items-center rounded-full border border-ink/15 overflow-hidden">
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  aria-label="Decrease quantity"
                  className="w-7 h-7 flex items-center justify-center text-base hover:bg-ink hover:text-cream transition-colors"
                >
                  −
                </button>
                <span className="w-7 text-center text-sm font-medium">
                  {product.quantity}
                </span>
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  aria-label="Increase quantity"
                  className="w-7 h-7 flex items-center justify-center text-base hover:bg-ink hover:text-cream transition-colors"
                >
                  +
                </button>
              </div>

              <p className="text-sm font-semibold text-ink">
                ${(product.price * product.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;
