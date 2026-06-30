import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "sonner";
import { RiDeleteBin3Line } from "react-icons/ri";
import StarRating from "../Common/StarRating";
import { Reveal } from "../Common/Reveal";
import {
  fetchReviews,
  submitReview,
  deleteReview,
  clearReviews,
} from "../../redux/slices/reviewSlice";

const ProductReviews = ({ productId }) => {
  const dispatch = useDispatch();
  const { reviews, loading, submitting } = useSelector(
    (state) => state.reviews
  );
  const { user } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (productId) dispatch(fetchReviews(productId));
    return () => dispatch(clearReviews());
  }, [dispatch, productId]);

  // Summary computed from the loaded reviews (stays in sync after add/delete)
  const { avg, count, distribution } = useMemo(() => {
    const count = reviews.length;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = count ? total / count : 0;
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      n: reviews.filter((r) => r.rating === star).length,
    }));
    return { avg, count, distribution };
  }, [reviews]);

  const myReview = user && reviews.find((r) => r.user === user._id);

  // Prefill the form when the user is editing their existing review
  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setTitle(myReview.title || "");
      setComment(myReview.comment || "");
    }
  }, [myReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a star rating");
    if (!comment.trim()) return toast.error("Please write a short review");

    const res = await dispatch(
      submitReview({ productId, rating, title, comment })
    );
    if (submitReview.fulfilled.match(res)) {
      toast.success("Thanks for your review!");
      setShowForm(false);
    } else {
      toast.error(res.payload?.message || "Could not submit review");
    }
  };

  const handleDelete = async (reviewId) => {
    const res = await dispatch(deleteReview(reviewId));
    if (deleteReview.fulfilled.match(res)) {
      toast.success("Review removed");
      setRating(0);
      setTitle("");
      setComment("");
      setShowForm(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <section className="mt-16 border-t border-ink/10 pt-12">
      <Reveal className="text-center mb-10">
        <div className="rule-gold w-12 mx-auto mb-4" />
        <p className="eyebrow mb-2">What Customers Say</p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">
          Ratings & Reviews
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* Summary */}
        <div className="lg:border-r lg:border-ink/10 lg:pr-8">
          <div className="text-center lg:text-left">
            <div className="flex items-end justify-center lg:justify-start gap-2 mb-2">
              <span className="font-display text-5xl font-semibold text-ink">
                {avg.toFixed(1)}
              </span>
              <span className="text-stone mb-1.5">/ 5</span>
            </div>
            <StarRating value={avg} size="md" />
            <p className="text-stone text-sm mt-2">
              Based on {count} {count === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Distribution bars */}
          {count > 0 && (
            <div className="mt-6 space-y-2">
              {distribution.map(({ star, n }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-3 text-stone">{star}</span>
                  <div className="flex-1 h-2 rounded-full bg-sand overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${count ? (n / count) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-stone">{n}</span>
                </div>
              ))}
            </div>
          )}

          {/* Write / edit review trigger */}
          <div className="mt-8">
            {user ? (
              <button
                onClick={() => setShowForm((s) => !s)}
                className="btn-outline w-full"
              >
                {showForm
                  ? "Cancel"
                  : myReview
                  ? "Edit your review"
                  : "Write a review"}
              </button>
            ) : (
              <Link to="/login" className="btn-outline w-full">
                Log in to review
              </Link>
            )}
          </div>
        </div>

        {/* Form + list */}
        <div>
          {/* Review form */}
          {user && showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-cream border border-ink/10 rounded-xl p-6 mb-8 animate-fade-up"
            >
              <h3 className="font-heading font-semibold text-ink mb-4">
                {myReview ? "Update your review" : "Share your thoughts"}
              </h3>
              <div className="mb-4">
                <label className="label-field">Your rating</label>
                <StarRating value={rating} onChange={setRating} size="lg" />
              </div>
              <div className="mb-4">
                <label className="label-field">Title (optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="Sum it up in a few words"
                  maxLength={120}
                />
              </div>
              <div className="mb-5">
                <label className="label-field">Your review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-field min-h-[110px] resize-y"
                  placeholder="What did you like or dislike?"
                  maxLength={2000}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {/* Reviews list */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : count === 0 ? (
            <div className="text-center py-12 text-stone">
              <p className="font-heading text-ink mb-1">No reviews yet</p>
              <p className="text-sm">Be the first to share your experience.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => {
                const isMine = user && review.user === user._id;
                return (
                  <div
                    key={review._id}
                    className="bg-white border border-ink/10 rounded-xl p-5 shadow-[var(--shadow-card)] animate-fade-up"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-soft text-accent flex items-center justify-center font-heading font-semibold uppercase">
                          {review.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-ink text-sm flex items-center gap-2">
                            {review.name}
                            {isMine && (
                              <span className="text-[10px] uppercase tracking-wider bg-sand text-stone px-1.5 py-0.5 rounded">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-stone">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      {isMine && (
                        <button
                          onClick={() => handleDelete(review._id)}
                          aria-label="Delete your review"
                          className="text-stone hover:text-danger transition-colors"
                        >
                          <RiDeleteBin3Line className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="mt-3">
                      <StarRating value={review.rating} size="sm" />
                      {review.title && (
                        <h4 className="font-heading font-semibold text-ink mt-2">
                          {review.title}
                        </h4>
                      )}
                      <p className="text-charcoal text-sm mt-1.5 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
