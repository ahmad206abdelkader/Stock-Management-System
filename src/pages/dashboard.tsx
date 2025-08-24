import { Card, CardContent } from "@/components/ui/card";

import { PackageSearch,ChartBarStacked,HandCoins } from "lucide-react";

import Contactus from "./contact-us";
import About from "./about";

export default function Dashboard() {
  return (
    <>
      <div className="">
        <div className="mb-10">
          <h1 className="ml-9 mt-9 font-bold text-[30px]">Dashboard</h1>
        </div>
        <div className="flex gap-5 ml-10 ">
          <Card className="w-40 h-40 hover:bg-gray-200">
            <CardContent className="inline aspect-square items-center justify-center p-6 ">
              <div className="flex gap-2">
                <PackageSearch />
                <span className=" text-blue-400">300</span>
              </div>
              <div><span>Total Products</span></div>
            </CardContent>
          </Card>
          <Card className="w-40 h-40 hover:bg-gray-200">
            <CardContent className="inline aspect-square items-center justify-center p-6">
              <div className="flex gap-2">
                <ChartBarStacked />
                <span className="">7</span>
              </div>
              <div><span>Categories</span></div>
            </CardContent>
          </Card>
          <Card className="w-40 h-40 hover:bg-gray-200">
            <CardContent className="inline aspect-square items-center justify-center p-6">
              <div className="flex gap-2">
                <HandCoins />
               <span className="">{4200}$</span>
              </div>
              <div><span>Total Amounts</span></div>
            </CardContent>
          </Card>
        </div>
        <div id="contact-us">
        <Contactus />
        </div>
        <div>
          <About />
        </div>
      </div>
    </>
  );
}
