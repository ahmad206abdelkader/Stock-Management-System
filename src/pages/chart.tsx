"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react"; // استيراد useAuth لجلب userId

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

const API = window.location.origin;

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
   const { userId } = useAuth(); // 1. جلب الـ userId
   const [loading, setLoading] = useState(false);
   const [categories, setCategories] = useState<Category[]>([]);

   const load = async () => {
    if (!userId) return; // 2. لا تطلب البيانات إذا لم يتم التعرف على المستخدم
    setLoading(true);
    try {
      // 3. إضافة userId إلى الرابط
      const res = await fetch(`${API}/api/categories?userId=${userId}`);
      const data = await res.json();

      // 4. التأكد أن البيانات مصفوفة Array قبل العمل عليها
      if (Array.isArray(data)) {
        const normalized = data.map((c: Category) => ({
          ...c,
          products: c.products ? c.products.map((p) => ({
            ...p,
            price: typeof p.price === "string" ? Number(p.price) : p.price,
          })) : [],
        }));
        setCategories(normalized);
      } else {
        setCategories([]);
      }
    } catch (e) {
      console.error("Failed to load categories", e);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    if (userId) {
      load();
    }
  }, [userId]); // التحديث عند تغير المستخدم

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    if (!Array.isArray(categories)) return out;

    for (const c of categories) {
      if (c.products && Array.isArray(c.products)) {
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
    <div className="w-full pb-24 md:pb-10 bg-white">
      <Header />
      <div className="px-4 md:px-10 py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
          Product Analysis Chart
        </h1>
        
        <div className="border rounded-xl p-2 md:p-6 bg-white shadow-sm overflow-hidden">
          <ChartContainer config={chartConfig} className="h-[350px] md:h-[500px] w-full">
            <BarChart 
              accessibilityLayer 
              data={chartData}
              margin={{ top: 20, right: 10, left: -10, bottom: 20 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="Product"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                fontSize={12}
                tickFormatter={(v: string) => (v?.length > 8 ? v.slice(0, 8) + "…" : v)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} className="text-sm" />
              <Bar dataKey="count" fill="black" radius={[4, 4, 0, 0]} barSize={window.innerWidth < 768 ? 25 : 45} />
              <Bar dataKey="price" fill="#9CA3AF" radius={[4, 4, 0, 0]} barSize={window.innerWidth < 768 ? 25 : 45} />
            </BarChart>
          </ChartContainer>
        </div>

        {loading && (
          <p className="mt-5 text-sm text-muted-foreground text-center animate-pulse">
            Loading chart data...
          </p>
        )}
        
        {!loading && rows.length === 0 && (
          <div className="mt-16 text-center flex flex-col items-center gap-4">
            <p className="text-muted-foreground bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
              No data to display. Add some products in the Category page first!
            </p>
          </div>
        )}
      </div>

      <div className="px-4 md:px-10 mt-10 space-y-12">
        <div id="contact-us">
          <Contactus />
        </div>
        <div id="about">
          <About />
        </div>
      </div>
    </div>
  </>
)};