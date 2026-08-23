import Hero from "@/components/site/Hero";
import { PopularProducts } from "@/components/site/PopularProducts";
import { NewestProducts } from "@/components/site/NewestProducts";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <Hero />
      <PopularProducts />
      <NewestProducts />
    </>
  );
}
