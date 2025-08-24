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

import { Input } from "@/components/ui/input";

import { Button } from "./components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { User, Home, Settings, TabletSmartphone } from "lucide-react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Homes from "./pages/home";
import Category from "./pages/category";
import Setting from "./pages/settings";
import About from "./pages/about";
import NotFound from "./pages/notfound";

import ProfileMenu from "./pages/profile_menu";
import Chart from "./pages/chart";

import { Link } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/home", element: <Homes /> },
  { path: "/category", element: <Category /> },
  { path: "/settings", element: <Setting /> },
  { path: "/about", element: <About /> },

  { path: "/profile_menu", element: <ProfileMenu /> },
  { path: "/chart", element: <Chart /> },
  { path: "*", element: <NotFound /> },
]);

const projects = [
  {
    name: "Home",
    url: "/home",
    icon: Home,
  },
  {
    name: "Category",
    url: "/category",
    icon: TabletSmartphone,
  },
  {
    name: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
{
  projects.map((item) => (
    <Link
      key={item.url}
      to={item.url}
      className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
    >
      <item.icon className="w-5 h-5" />
      {item.name}
    </Link>
  ));
}

function App() {
  return (
    <>
      ;
      <SidebarProvider>
        <div>
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Stock Management System</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {projects.map((project) => (
                      <SidebarMenuItem key={project.name}>
                        <SidebarMenuButton asChild>
                          <a href={project.url}>
                            <project.icon />
                            <span>{project.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    {/* sign in dialog */}
                    <Dialog>
                      <DialogTrigger className="ml-1.5 mt-5 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer flex items-center  gap-0.5 ">
                        <User className="w-5 h-5" />
                        <span>Sign in</span>
                      </DialogTrigger>
                      <DialogContent>
                        {/*dont remove dialogTitle bec import dialogContent from reduxUi you can not do this without providing a <DialogTitle> inside it */}
                        <DialogTitle />
                        <DialogHeader>
                          {/* tabs sign in */}
                          <Tabs defaultValue="account" className="w-[400px]">
                            <TabsList>
                              <TabsTrigger value="account">Sign In</TabsTrigger>
                              <TabsTrigger value="password">Log in</TabsTrigger>
                            </TabsList>
                            <TabsContent value="account">
                              <span className="ml-2">Create an account</span>
                              <div className="mt-8">
                                <div className="w-full max-w-sm items-center gap-2">
                                  <div className="">
                                    <Input type="email" placeholder="Email" />
                                    <Input
                                      type="password"
                                      placeholder="Password"
                                    />
                                  </div>
                                  <Button
                                    className="hover:bg-gray-300 "
                                    type="submit"
                                    variant="outline"
                                  >
                                    Create
                                  </Button>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="password">
                              <span className="ml-2">
                                Log in to your account
                              </span>
                              <div className="mt-8">
                                <div className="w-full max-w-sm items-center gap-2">
                                  <div className="">
                                    <Input type="email" placeholder="Email" />
                                    <Input
                                      type="password"
                                      placeholder="Password"
                                    />
                                  </div>
                                  <Button
                                    className="hover:bg-gray-300 "
                                    type="submit"
                                    variant="outline"
                                  >
                                    Log in
                                  </Button>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>
        <RouterProvider router={router} />
      </SidebarProvider>
    </>
  );
}

export default App;
