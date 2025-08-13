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
  SidebarMenuButton
} from "@/components/ui/sidebar";

import { Input } from "@/components/ui/input";

import { Button } from "./components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { User, Home, Settings, TabletSmartphone } from "lucide-react";

const projects = [
  {
    name: "Home",
    url: "/home",
    icon: Home
  },
  {
    name: "Category",
    url: "/category",
    icon: TabletSmartphone
  },
  {
    name: "Settings",
    url: "/settings",
    icon: Settings
  }
];

function App() {
  return (
    <>
      <SidebarProvider>
        <div>
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Stock Management System</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {projects.map(project => (
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
                        <DialogTitle></DialogTitle>
                        <DialogHeader>
                          {/* tabs sign in */}
                          <Tabs defaultValue="account" className="w-[400px]">
                            <TabsList>
                              <TabsTrigger value="account">Sign In</TabsTrigger>
                              <TabsTrigger value="password">Sign out</TabsTrigger>
                            </TabsList>
                            <TabsContent value="account">
                              <span className="ml-2">Do you have an email?</span>
                              <div className="mt-8">
                                <div className="flex w-full max-w-sm items-center gap-2">
                                  <Input type="email" placeholder="Email" />
                                  <Button type="submit" variant="outline">
                                    Subscribe
                                  </Button>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="password">Are you sure you want to log out?</TabsContent>
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
      </SidebarProvider>
    </>
  );
}

export default App;
