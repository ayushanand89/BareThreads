// Shared dummy-review data used by the full seeder and the reviews-only seeder.

export const reviewerNames = [
  "Aarav Mehta",
  "Sophia Carter",
  "Liam O'Brien",
  "Isabella Rossi",
  "Noah Williams",
  "Priya Sharma",
  "Ethan Walker",
  "Mia Nguyen",
  "Lucas Schmidt",
  "Ava Thompson",
  "Diego Hernandez",
  "Chloe Dubois",
  "Kenji Tanaka",
  "Amara Okafor",
  "Oliver Bennett",
  "Freya Andersen",
  "Marcus Lee",
  "Elena Petrova",
  "Rohan Kapoor",
  "Grace Sullivan",
  "Mateo Romano",
  "Yuki Sato",
  "Layla Hassan",
  "Benjamin Clark",
  "Nina Kowalski",
  "Andre Silva",
  "Hannah Becker",
  "Tariq Aziz",
  "Camila Torres",
  "Felix Wagner",
];

export const reviewers = reviewerNames.map((name) => ({
  name,
  email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}.reviewer@example.com`,
}));

export const reviewSnippets = [
  {
    rating: 5,
    title: "Absolutely love it",
    comment:
      "Exceeded my expectations. The fabric feels premium and the fit is spot on. Will definitely be buying more.",
  },
  {
    rating: 5,
    title: "Perfect fit and quality",
    comment:
      "True to size and incredibly comfortable. The stitching is clean and it looks even better in person.",
  },
  {
    rating: 5,
    title: "Worth every penny",
    comment:
      "Such a great quality piece for the price. Washed it twice and it still looks brand new.",
  },
  {
    rating: 4,
    title: "Really nice, minor sizing note",
    comment:
      "Great material and color. Runs slightly large so consider sizing down, but overall very happy.",
  },
  {
    rating: 4,
    title: "Good value",
    comment:
      "Comfortable and stylish. Shipping was quick. Knocking off one star only because I wish it came in more colors.",
  },
  {
    rating: 4,
    title: "Solid everyday piece",
    comment:
      "Exactly what I was looking for. Holds up well throughout the day and pairs with almost everything.",
  },
  {
    rating: 3,
    title: "Decent but not amazing",
    comment:
      "It's okay for the price. The fit is fine but the fabric is a little thinner than I expected.",
  },
  {
    rating: 5,
    title: "My new favorite",
    comment:
      "I keep reaching for this one. Soft, breathable, and the cut is really flattering.",
  },
  {
    rating: 4,
    title: "Looks premium",
    comment:
      "Feels much more expensive than it is. Got a few compliments already the first time I wore it.",
  },
  {
    rating: 5,
    title: "Highly recommend",
    comment:
      "Fast delivery and excellent quality. The color is exactly as pictured. Couldn't be happier.",
  },
  {
    rating: 5,
    title: "Beautiful craftsmanship",
    comment:
      "You can tell a lot of thought went into the details. The finish is impeccable and it drapes beautifully.",
  },
  {
    rating: 4,
    title: "Great everyday wear",
    comment:
      "Comfortable enough to wear all day and still looks polished. Has quickly become a staple in my rotation.",
  },
  {
    rating: 5,
    title: "Exceeded expectations",
    comment:
      "Honestly didn't expect this level of quality. Soft, well-made, and the sizing chart was accurate.",
  },
  {
    rating: 4,
    title: "Lovely, runs a touch small",
    comment:
      "Gorgeous piece and great fabric. I'd recommend sizing up if you're between sizes, otherwise perfect.",
  },
  {
    rating: 3,
    title: "Nice but wrinkles easily",
    comment:
      "Looks lovely on but creases quickly through the day. Still good for the price, just keep an iron handy.",
  },
  {
    rating: 5,
    title: "Compliment magnet",
    comment:
      "Wore it out and got stopped twice to ask where it was from. Feels luxe and fits like it was made for me.",
  },
  {
    rating: 4,
    title: "Happy with this one",
    comment:
      "Good weight to the fabric and a flattering cut. Delivery was quick and packaging felt premium.",
  },
  {
    rating: 5,
    title: "Buy it, you won't regret it",
    comment:
      "Second piece I've ordered and the consistency is fantastic. Holds color and shape wash after wash.",
  },
  {
    rating: 2,
    title: "Not quite for me",
    comment:
      "The quality is fine but the fit was boxier than I hoped. Returns were easy though, no complaints there.",
  },
  {
    rating: 5,
    title: "Instant wardrobe staple",
    comment:
      "Versatile, comfortable, and beautifully made. This is exactly the kind of piece you reach for on repeat.",
  },
];

export const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Build review documents for one product from the available reviewer docs.
export const buildReviewsForProduct = (productId, reviewerDocs) => {
  const numReviews = randInt(5, 14);
  const chosenReviewers = shuffle(reviewerDocs).slice(0, numReviews);

  return chosenReviewers.map((reviewer, i) => {
    const snippet =
      reviewSnippets[
        (i + randInt(0, reviewSnippets.length - 1)) % reviewSnippets.length
      ];
    return {
      product: productId,
      user: reviewer._id,
      name: reviewer.name,
      rating: snippet.rating,
      title: snippet.title,
      comment: snippet.comment,
    };
  });
};
