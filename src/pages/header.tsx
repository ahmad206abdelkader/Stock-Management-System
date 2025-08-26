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

export default function Header() {
  return (
    <>
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Home</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-non focus:shadow-md"
                        href="/category"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium">
                          Category
                        </div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          Browse and manage all product categories easily in one
                          place
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/settings" title="Settings">
                    Customize your experience and update settings
                  </ListItem>

                  <ListItem href="#contact-us" title="Contact us">
                    Got a question or need help? Contact us today
                  </ListItem>

                  <ListItem href="/about" title="About">
                    Discover who we are and what we stand for
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categoruy</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/about">Test</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="#">Test</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="#">Test</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Chart</NavigationMenuTrigger>
              <NavigationMenuContent className="pr-20">
                <div className="flex pr-20">
                <h1>Chart:</h1>
                <p className="text-sm text-gray-800 whitespace-normal line-clamp-4">
                  <span>
                    This chart shows the overall performance trend during the
                    selected period.
                  </span>
                </p>
                </div>
                <Link to="/chart">
                  <Button>Chart</Button>
                </Link>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Profile Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <ListItem href="/profile_menu" title="profile managment">
                    Customize your experience and update settings
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <hr className="border-gray-300 my-2"></hr>
      </div>
    </>
  );
}
