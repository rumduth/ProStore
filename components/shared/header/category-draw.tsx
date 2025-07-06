import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/product.actions";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export default async function CategoryDrawer() {
  const categories = await getAllCategories();
  return (
    <>
      <Drawer direction="left">
        <DrawerTrigger asChild>
          <Button variant="outline">
            <MenuIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="mt-9">Select a category</DrawerTitle>
            <div className="space-y-1">
              {categories.map((x) => (
                <Button
                  key={x.category}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <DrawerClose asChild>
                    <Link href={`/search?category=${x.category}`}>
                      {x.category} ({x._count})
                    </Link>
                  </DrawerClose>
                </Button>
              ))}
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
}
