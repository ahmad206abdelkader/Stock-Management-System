import "./App.css";
import {
  Sidebar,
  SidebarMenu,
  SidebarGroupContent,
  SidebarContent,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { Home, Settings, TabletSmartphone,  BarChart3 } from "lucide-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import Homes from "./pages/home";
import Category from "./pages/category";
import Setting from "./pages/settings";
import About from "./pages/about";
import NotFound from "./pages/notfound";
import ProfileMenu from "./pages/profile_menu";
import Chart from "./pages/chart";

// Clerk Imports
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Check your .env file.");
}

const router = createBrowserRouter([
  { path: "/", element: <Homes /> },
  { path: "/home", element: <Homes /> },
  { path: "/category", element: <Category /> },
  { path: "/settings", element: <Setting /> },
  { path: "/about", element: <About /> },
  { path: "/profile_menu", element: <ProfileMenu /> },
  { path: "/chart", element: <Chart /> },
  { path: "*", element: <NotFound /> },
]);


const navigationLinks = [
  { name: "Home", url: "/home", icon: Home },
  { name: "Category", url: "/category", icon: TabletSmartphone },
  { name: "Charts", url: "/chart", icon: BarChart3 },
  { name: "Settings", url: "/settings", icon: Settings },
];

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SignedOut>
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <RedirectToSignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <SidebarProvider>
          <div className="flex flex-col md:flex-row h-screen w-full bg-white">
            
           
            <div className="hidden md:block">
              <Sidebar className="border-r border-gray-200">
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel className="text-blue-600 font-bold px-4 py-4">Stock System</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {navigationLinks.map((item) => (
                          <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton asChild>
                              <a href={item.url} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-all">
                                <item.icon size={20} />
                                <span className="font-medium">{item.name}</span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                        
                        <div className="mt-auto pt-10 border-t mx-2">
                          <div className="flex items-center gap-3 p-2">
                            <UserButton afterSignOutUrl="/" />
                            <span className="text-sm font-semibold text-gray-700">My Account</span>
                          </div>
                        </div>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </div>

            
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-[420px]">
              <nav className="flex items-center justify-around bg-black/80 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[24px] p-2 px-3">
                {navigationLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    className="group relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 hover:bg-white/10"
                  >
                    <item.icon size={24} className="text-white group-hover:scale-125 transition-transform duration-300" />
                   
                    <div className="opacity-0 group-hover:opacity-100 mt-1 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa] transition-all"></div>
                  </a>
                ))}
                
             
                <div className="p-1 border-l border-white/10 pl-2 ml-1">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </nav>
            </div>

            
            <main className="flex-1 overflow-auto bg-white pb-24 md:pb-4">
              <RouterProvider router={router} />
            </main>
          </div>
        </SidebarProvider>
      </SignedIn>
    </ClerkProvider>
  );
}