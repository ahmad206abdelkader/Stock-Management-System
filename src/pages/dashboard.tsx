import { Card, CardContent } from "@/components/ui/card";
import { PackageSearch, ChartBarStacked, HandCoins } from "lucide-react";
import Contactus from "./contact-us";
import About from "./about";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@clerk/clerk-react"; 

type Product = {
  id: number;
  name: string;
  price: number | string;
  count: number;
};

type Category = {
  id: number;
  name: string;
  products: Product[];
};

const API = "";

export default function Dashboard() {
  const { userId } = useAuth(); 
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!userId) return;

    fetch(`${API}/api/categories?userId=${userId}`) 
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
       
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  const stats = useMemo(() => {
    let totalProducts = 0;
    let totalAmount = 0;

    
    if (Array.isArray(categories)) {
      categories.forEach((cat) => {
        if (cat.products && Array.isArray(cat.products)) {
          cat.products.forEach((prod) => {
            totalProducts += 1;
            totalAmount += Number(prod.price) * prod.count;
          });
        }
      });
    }

    return {
      totalProducts,
      totalCategories: categories.length,
      totalAmount,
    };
  }, [categories]);

  if (!userId) return <div className="p-10 text-center">Loading User...</div>;

   

  return (
  <>
    <div className="w-full pb-10">
    
      <div className="mb-10 px-6 md:px-10">
        <h1 className="mt-9 font-bold text-[24px] md:text-[30px]">Dashboard</h1>
      </div>
      
      {loading ? (
         <div className="px-10 text-gray-500">Loading Stats...</div>
      ) : (
       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-10">
          
          
          <Card className="w-full h-40 hover:bg-gray-200 transition-colors shadow-sm">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="flex items-center gap-3 mb-2">
                <PackageSearch className="w-6 h-6 text-blue-500" />
                <span className="text-2xl font-bold text-blue-400">{stats.totalProducts}</span>
              </div>
              <div className="font-medium text-gray-600">Total Products</div>
            </CardContent>
          </Card>

         
          <Card className="w-full h-40 hover:bg-gray-200 transition-colors shadow-sm">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="flex items-center gap-3 mb-2">
                <ChartBarStacked className="w-6 h-6 text-gray-700" />
                <span className="text-2xl font-bold">{stats.totalCategories}</span>
              </div>
              <div className="font-medium text-gray-600">Categories</div>
            </CardContent>
          </Card>

         
          <Card className="w-full h-40 hover:bg-gray-200 transition-colors shadow-sm">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="flex items-center gap-3 mb-2">
                <HandCoins className="w-6 h-6 text-green-600" />
                <span className="text-2xl font-bold">{stats.totalAmount.toLocaleString()}$</span>
              </div>
              <div className="font-medium text-gray-600">Total Amounts</div>
            </CardContent>
          </Card>

        </div>
      )}

     
      <div className="px-6 md:px-10 mt-10 space-y-10">
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