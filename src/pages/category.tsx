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

import { useEffect, useMemo, useState } from "react";
import { Form } from "react-router";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Contactus from "./contact-us";
import Header from "./header";
import About from "./about";

type Product = {
  id: number;
  name: string;
  price: string | number;
  count: number;
  categoryId: number;
};

type Category = {
  id: number;
  name: string;
  products: Product[];
  createdAt?: string;
  updatedAt?: string;
  totalValue?: number;
};

const API = "http://localhost:8000";

export default function CategoryPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    categoryName: "",
    productName: "",
    count: 0,
    price: 0,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/categories`);
      const data: Category[] = await res.json();
      const normalized = data.map((c) => ({
        ...c,
        products: c.products.map((p) => ({
          ...p,
          price: typeof p.price === "string" ? Number(p.price) : p.price,
        })),
      }));

      setCategories(normalized);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const catName = form.categoryName.trim();
    const prodName = form.productName.trim();
    const price = Number(form.price);
    const count = Number(form.count);

    if (!catName || !prodName) return alert("enter category or product name");
    if (price < 0 || count < 0) return alert("dont enter the nigativ number");

    setLoading(true);
    try {
      let category = categories.find(
        (c) => c.name.toLowerCase() === catName.toLowerCase()
      );

      if (!category) {
        const createCat = await fetch(`${API}/api/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: catName }),
        });
        if (!createCat.ok) throw new Error("failed create category");
        category = await createCat.json();
      }

      const createProd = await fetch(`${API}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.productName,
          price: Number(form.price),
          count: Number(form.count),
          categoryId: category!.id,
        }),
      });
      if (!createProd.ok) throw new Error("failed create product");

      await load();

      setForm({ categoryName: "", productName: "", count: 0, price: 0 });
    } catch (err: any) {
      alert(err.message || "somthing is wrong");
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => {
    const out: Array<{
      category: string;
      product: string;
      count: number;
      price: number;
      total: number;
      id: string;
    }> = [];
    for (const c of categories) {
      for (const p of c.products) {
        const priceNum =
          typeof p.price === "string" ? Number(p.price) : (p.price as number);
        out.push({
          id: `${c.id}-${p.id}`,
          category: c.name,
          product: p.name,
          count: p.count,
          price: priceNum,
          total: priceNum * p.count,
        });
      }
    }
    return out;
  }, [categories]);

  const grandTotal = useMemo(
    () => rows.reduce((s, r) => s + r.total, 0),
    [rows]
  );

  

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
          <div className="grid gap-3 ml-10 mt-9">
            <Form id="inputs_category" onSubmit={handleSubmit}>
              <div className="flex gap-4">
                <div>
                  <span>Add Category :</span>
                  <Input
                    type="text"
                    placeholder="Enter Category here"
                    value={form.categoryName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, categoryName: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <span>Add Product :</span>
                  <Input
                    type="text"
                    placeholder="Enter your Product here"
                    value={form.productName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, productName: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <span>Count Of Product :</span>
                  <Input
                    type="number"
                    placeholder="Number Of Products"
                    value={form.count}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        count: Number(e.target.value) || 0,
                      }))
                    }
                    min={0}
                  />
                </div>
                <div>
                  <span>Price :</span>
                  <Input
                    type="number"
                    placeholder="Enter Product Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        price: Number(e.target.value) || 0,
                      }))
                    }
                    min={0}
                    
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading}>
                conform{loading ? "Saving..." : "Save"}
              </Button>
            </Form>
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
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.category}</TableCell>
                    <TableCell>{r.product}</TableCell>
                    <TableCell>{r.count}</TableCell>
                    <TableCell>{r.price}</TableCell>
                    <TableCell className="text-right">{r.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {loading ? "Loading..." : "No products yet"}
                  </TableCell>
                </TableRow>
              )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>total</TableCell>
                  <TableCell className="text-right">{grandTotal.toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
        <div id="contact-us">
          <Contactus />
        </div>
        <div id="about">
          <About />
        </div>
      </div>
    </>
  );
}
//https://excalidraw.com/#json=685aiOC3IWa12OxOZaSmb,-1w3o9FzMSwryLxcpFisOg explan code