import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function SignIn() {

    return(
        <>
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
                                    <Input type="password" placeholder="Password" />
                                  </div>
                                  <Button className="hover:bg-gray-300 " type="submit" variant="outline">
                                    Create
                                  </Button>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="password">
                              <span className="ml-2">Log in to your account</span>
                              <div className="mt-8">
                                <div className="w-full max-w-sm items-center gap-2">
                                  <div className="">
                                    <Input type="email" placeholder="Email" />
                                    <Input type="password" placeholder="Password" />
                                  </div>
                                  <Button className="hover:bg-gray-300 " type="submit" variant="outline">
                                    Log in
                                  </Button>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
        </>
    )
}
