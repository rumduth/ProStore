import DealCountdown from "@/components/deal-countdown";
import IconBoxes from "@/components/icon-boxes";
import ProductsCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products-button";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";
import { Product } from "@/types";
export default async function Homepage() {
  const latestProducts: Product[] = await getLatestProducts();
  const featuredProducts: Product[] = await getFeaturedProducts();
  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductsCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
    </>
  );
}
