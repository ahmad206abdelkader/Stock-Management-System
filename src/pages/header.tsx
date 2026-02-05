import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Link } from "react-router-dom";
import { ListItem } from "@/components/ui/ListItem";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

type Category = {
  id: number;
  name: string;
};

export default function Header() {
  const { userId } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const API = "http://localhost:8000";

  useEffect(() => {
    if (userId) {
      // التصحيح هنا: إضافة علامة $ قبل {API}
      fetch(`${API}/api/categories?userId=${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setCategories(data);
          }
        })
        .catch((err) => console.error("Header fetch error:", err));
    }
  }, [userId, API]); // أضفنا API للمصفوفة لضمان الدقة

  return (
    <>
      <div className="w-full">
        <NavigationMenu>
          <NavigationMenuList>
            {/* القائمة الرئيسية: Home */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Home</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-non focus:shadow-md bg-gray-50"
                        to="/category"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium">Category</div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          Browse and manage all product categories easily in one place.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/settings" title="Settings">
                    Customize your experience and update settings.
                  </ListItem>
                  <ListItem href="#contact-us" title="Contact us">
                    Got a question or need help? Contact us today.
                  </ListItem>
                  <ListItem href="#about" title="About">
                    Discover who we are and what we stand for.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* القائمة الديناميكية: Category */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Category</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-1 p-2">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <li key={cat.id}>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/category" 
                            className="block select-none space-y-1 rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            {cat.name}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))
                  ) : (
                    <li className="p-3 text-xs text-muted-foreground text-center">
                      No categories found
                    </li>
                  )}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* قائمة الـ Chart */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Chart</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="p-4 w-[250px]">
                  <h1 className="font-bold mb-2">Analysis Chart:</h1>
                  <p className="text-xs text-gray-600 mb-4">
                    This chart shows the overall performance trend during the selected period.
                  </p>
                  <Link to="/chart">
                    <Button className="w-full text-xs h-8">Open Chart View</Button>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* قائمة البروفايل */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Profile Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 p-4 md:w-[250px]">
                  <ListItem href="/profile_menu" title="Profile Management">
                    Update your personal settings and info.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <hr className="border-gray-200 my-1" />
      </div>
    </>
  );
}