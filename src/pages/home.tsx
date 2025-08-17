import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import { ListItem } from "@/components/ui/ListItem";



const components: { title: string; href:string; describtion: string }[] =[
 
]

export default function home() {
  return <>
  <div>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Home</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
            <li className="row-span-3">
              <NavigationMenuLink asChild>
                <a className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-non focus:shadow-md" 
                href="/category">
                  <div className="mt-4 mb-2 text-lg font-medium">
                    Category
                  </div>
                  <p className="text-muted-foreground text-sm leading-tight">
                    Browse and manage all product categories easily in one place
                  </p>
                </a>
              </NavigationMenuLink>
            </li>
            <ListItem href="/settings" title="Settings">
                Customize your experience and update settings
            </ListItem>
            <ListItem href="/contact_us" title="Contact us">
                Got a question or need help? Contact us today
            </ListItem>
            <ListItem href="/about" title="About">
                Discover who we are and what we stand for
            </ListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger>test</NavigationMenuTrigger>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger>test</NavigationMenuTrigger>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger>test</NavigationMenuTrigger>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</div>
  </>
}