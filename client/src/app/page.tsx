import Container from "@/components/common/Container";
import Banner from "@/components/home/Banner";
import CategoriesSection from "@/components/home/CategoriesSection";

export default async function Home() {

  return (
    <div>
      <Container className="min-h-screen flex py-7 gap-3">
        <CategoriesSection />
        <div className="flex-1">
          <Banner />
          {/* <ProductList />
          <HomeBrand brands={brands} />
          <BabyTravelSection />
          <ComfyApparelSection />
          <FeaturedServicesSection /> */}
        </div>
      </Container>
    </div>
  );
}