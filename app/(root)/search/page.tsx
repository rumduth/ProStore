import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getAllProducts,
  getAllCategories,
} from "@/lib/actions/product.actions";
import Link from "next/link";

const prices = [
  { name: "$1 to $50", value: "1-50" },
  { name: "$51 to $100", value: "51-100" },
  { name: "$101 to $200", value: "101-200" },
  { name: "$201 to $500", value: "201-500" },
  { name: "$501 to $1000", value: "501-1000" },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ["newest", "lowest", "highest", "rating"];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q?: string;
    price?: string;
    category?: string;
    rating?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const q = searchParams.q || "all";
  const category = searchParams.category || "all";
  const price = searchParams.price || "all";
  const rating = searchParams.rating || "all";

  const isQuerySet = q !== "all" && q.trim() !== "";
  const isCategorySet = category !== "all" && category.trim() !== "";
  const isPriceSet = price !== "all" && price.trim() !== "";
  const isRatingSet = rating !== "all" && rating.trim() !== "";
  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet)
    return {
      title: `Search ${isQuerySet ? q : ""} ${
        isCategorySet ? `: Category: ${category}` : ""
      }
       ${isPriceSet ? `: Price: ${category}` : ""}
       ${isRatingSet ? `: Rating: ${rating}` : ""}
      `,
    };
  return {
    title: "Search Product",
  };
}

export default async function SearchPage(props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const q = searchParams.q || "all";
  const category = searchParams.category || "all";
  const price = searchParams.price || "all";
  const rating = searchParams.rating || "all";
  const sort = searchParams.sort || "newest";
  const page = searchParams.page || "1";

  //Construct filter url

  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, page, sort };
    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    page: Number(page),
    sort,
  });

  const categories = await getAllCategories();

  return (
    <>
      <div className="grid md:grid-cols-5 md:gap-5">
        <div className="filter-links">
          <div className="text-xl mb-2 mt-3">Department</div>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${category === "all" && "font-bold"}`}
                  href={getFilterUrl({ c: "all" })}
                >
                  Any
                </Link>
              </li>
              {categories.map((x) => (
                <li key={x.category}>
                  <Link
                    className={`${category === x.category && "font-bold"}`}
                    href={getFilterUrl({ c: x.category })}
                  >
                    {x.category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xl mb-2 mt-8">Prices</div>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${category === "all" && "font-bold"}`}
                  href={getFilterUrl({ p: "all" })}
                >
                  Any
                </Link>
              </li>
              {prices.map((x) => (
                <li key={x.value}>
                  <Link
                    className={`${price === x.value && "font-bold"}`}
                    href={getFilterUrl({ p: x.value })}
                  >
                    {x.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xl mb-2 mt-8">Customer Ratings</div>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${rating === "all" && "font-bold"}`}
                  href={getFilterUrl({ r: "all" })}
                >
                  Any
                </Link>
              </li>
              {ratings.map((x) => (
                <li key={x}>
                  <Link
                    className={`${rating === x.toString() && "font-bold"}`}
                    href={getFilterUrl({ r: x.toString() })}
                  >
                    {x} stars & up
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4 md:col-span-4">
          <div className="flex-between flex-col md:flex-row my-4">
            <div className="flex items-center gap-4">
              {q !== "all" && <span>Query: {q}</span>}
              {category !== "all" && <span> Category: {category}</span>}
              {price !== "all" && <span> Price: {price}</span>}
              {rating !== "all" && <span> Rating: {rating} stars & up</span>}
              &nbsp;
              {q !== "all" ||
              category !== "all" ||
              rating !== "all" ||
              price !== "all" ? (
                <Button variant="link" asChild>
                  <Link href="/search">Clear</Link>
                </Button>
              ) : null}
            </div>
            <div>
              Sort By{" "}
              {sortOrders.map((x) => (
                <Link
                  key={x}
                  className={`mx-2 ${sort === x && "font-bold"}`}
                  href={getFilterUrl({ s: x })}
                >
                  {x}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {products.data.length === 0 && <div>No products found</div>}
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
