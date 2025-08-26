import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import Header from "./header";

const Categories = [
  {
   category:"phone",
   product:"iphone 13 256gb",
   count:"3",
   price:"400$",
   total:"1200"
  },
  {
   category:"tablet",
   product:"samsung a13",
   count:"2",
   price:"500$",
   total:"1000"
  },
  {
   category:"phone",
   product:"iphone 11 256gb",
   count:"6",
   price:"150$",
   total:"900"
  },
]


export default function Category() {
  return (
    <>
      <div>
        <div>
          <Header />
        </div>
        <div>
          <div>
            <h1 className="ml-9 mt-9 font-bold text-[30px]">Category</h1>
          </div>
          <div className="grid gap-3 ml-10 mt-9" id="inputs_category">
            <div className="flex gap-4">
              <div>
                <span>Add Category :</span>
                <Input type="text" placeholder="Enter Category here" />
              </div>
              <div>
                <span>Add Product :</span>
                <Input type="text" placeholder="Enter your Product here" />
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <span>Count Of Product :</span>
                <Input type="number" placeholder="Number Of Products" />
              </div>
              <div>
                <span>Price :</span>
                <Input type="number" placeholder="Enter Product Price" />
              </div>
            </div>
          </div>
          <div className="ml-9 mt-9" id="tabels">
            <Table>
              <TableCaption>
                A list of your products and categories.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Category</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>count</TableHead>
                  <TableHead>price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Categories.map((Category) => (
                <TableRow>
                  <TableCell className="font-medium">{Category.category}</TableCell>
                  <TableCell>{Category.product}</TableCell>
                  <TableCell>{Category.count}</TableCell>
                  <TableCell>{Category.price}</TableCell>
                  <TableCell className="text-right">{Category.total}</TableCell>
                </TableRow>
                 ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>total</TableCell>
                  <TableCell className="text-right">$222222</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
