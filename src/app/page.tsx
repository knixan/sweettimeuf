import Hero from "@/components/site/Hero";
import { PopularProducts } from "@/components/site/PopularProducts";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <Hero />
      <PopularProducts />
   
    </>
  );
}
