"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useMemo, useState, useEffect } from "react";


import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import Header from "./header";
import Contactus from "./contact-us";
import About from "./about";

type Product = {
  id: number;
  name: string;
  price: string | number;
  count: number;
  categoryId: number;
};

type Category = {
  id: number;
  name: string;
  products: Product[];
  createdAt?: string;
  updatedAt?: string;
};

type Row = { id: string; product: string; category: string; count: number; price: number; total: number };

const API = "http://localhost:8000";

const chartConfig = {
  count: {
    label: "Count",
    color: "#2563eb",
  },
  price: {
    label: "Price",
    color: "#60a5fa",
  },
};

export default function Chart() {
   const [loading, setLoading] = useState(false);
   const [categories, setCategories] = useState<Category[]>([]);

   const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/categories`);
      const data: Category[] = await res.json();

     
      const normalized = data.map((c) => ({
        ...c,
        products: c.products.map((p) => ({
          ...p,
          price: typeof p.price === "string" ? Number(p.price) : p.price,
        })),
      }));
      setCategories(normalized);
    } catch (e) {
      console.error("Failed to load categories", e);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    load();
  }, []);

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    for (const c of categories) {
      for (const p of c.products) {
        const priceNum = typeof p.price === "string" ? Number(p.price) : (p.price as number);
        out.push({
          id: `${c.id}-${p.id}`,
          category: c.name,
          product: p.name,
          count: p.count,
          price: priceNum || 0,
          total: (priceNum || 0) * (p.count || 0),
        });
      }
    }
    return out;
  }, [categories]);


  const chartData = useMemo(
    () =>
      rows.map((r) => ({
        Product: r.product,
        count: r.count, 
        price: r.price, 
      })),
    [rows]
  );

  return (
    <>
      <div>
        <div>
          <Header />
        </div>
        <div className="">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="Product"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(v: string) => (v?.length > 10 ? v.slice(0, 10) + "…" : v)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="count" fill="black" radius={4} />
              <Bar dataKey="price" fill="#9CA3AF" radius={4} />
            </BarChart>
          </ChartContainer>
           {loading && <p className="mt-3 text-sm text-muted-foreground">Loading...</p>}
          {!loading && rows.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">No data to display</p>
          )}
        </div>
        <div id="contact-us">
          <Contactus />
        </div>
        <div id="about">
          <About />
        </div>
      </div>
    </>
  );
}
