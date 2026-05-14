import ShopPageClient from "@/components/common/pages/shop/ShopPageClient";
import { fetchData } from "@/lib/api";
import React from "react";
import { Brand, Category } from "../../../type";

interface CategoriesResponse {
  categories: Category[];
}

const ShopPage = async () => {
  const brands = await fetchData<Brand[]>("/brands");
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    const data = await fetchData<CategoriesResponse>("/categories");
    categories = data.categories;
  } catch (err) {
    error = err instanceof Error ? err.message : "An unknown error occurred";
    console.log("error", error);
  }

  console.log("categories", categories);
  console.log("brands", brands);


  return <ShopPageClient categories={categories} brands={brands} />;
};

export default ShopPage;