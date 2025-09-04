"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

const chartData = [
  { Product: "iphone11", desktop: 186, mobile: 80 },
  { Product: "tab 2", desktop: 305, mobile: 200 },
  { Product: "samsung a2", desktop: 237, mobile: 120 },
  { Product: "phone14", desktop: 73, mobile: 190 },
  
  
];

const chartConfig = {
  desktop: {
    label: "Count",
    color: "#2563eb",
  },
  mobile: {
    label: "Price",
    color: "#60a5fa",
  },
};

export default function Chart() {
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
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="desktop" fill="black" radius={4} />
              <Bar dataKey="mobile" fill="#9CA3AF" radius={4} />
            </BarChart>
          </ChartContainer>
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
