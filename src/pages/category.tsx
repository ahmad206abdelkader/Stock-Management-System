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
        (c) => c.name.toLowerCase() === catName.toLowerCase(),
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
    [rows],
  );

  const [deleteName, setDeleteName] = useState("");

  const handleDelete = async (type: "category" | "product") => {
    if (!deleteName.trim()) return alert("Please enter a name to delete");

    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    setLoading(true);
    try {
      const endpoint =
        type === "category"
          ? `${API}/api/categories/name/${deleteName}`
          : `${API}/api/products/name/${deleteName}`;

      const res = await fetch(endpoint, { method: "DELETE" });

      if (!res.ok) throw new Error("Delete failed - Name might not exist");

      alert(`${type} deleted successfully`);
      setDeleteName("");
      await load();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [editForm, setEditForm] = useState({ name: "", price: 0, count: 0 });

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    const product = rows.find((r) => r.id === id);
    if (product) {
      setEditForm({
        name: product.product,
        price: product.price,
        count: product.count,
      });
    }
  };

  const handleUpdate = async () => {
  if (!selectedProductId) return;
  const [catId, prodId] = selectedProductId.split('-'); // فك الـ id المركب

  setLoading(true);
  try {
    const res = await fetch(`${API}/api/products/${prodId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    if (!res.ok) throw new Error("Update failed");

    alert("Product updated!");
    await load();
  } catch (err: any) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

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
              <Button type="submit" disabled={loading} className=" mt-3">
                Conform {loading ? "Saving..." : "Save"}
              </Button>
            </Form>
          </div>

          <div className="grid gap-3 ml-10 p-4 border rounded-lg bg-red-50/10 mt-6">
            <h2 className="text-xl font-semibold text-red-600">Delete Items</h2>
            <div className="flex gap-4 items.end">
              <div>
                <span>Enter Name to Delete:</span>
                <Input
                  type="test"
                  placeholder="Category or product Name"
                  value={deleteName}
                  onChange={(e) => setDeleteName(e.target.value)}
                  className="border-red-300"
                />
              </div>
              <Button
                variant="destructive"
                onClick={() => handleDelete("product")}
                disabled={loading}
              >
                Delete Product
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete("category")}
                disabled={loading}
              >
                Delete Category
              </Button>
            </div>
          </div>


          <div className="grid gap-3 ml-10 p-4 border rounded-lg bg-blue-50/10 mt-6">
  <h2 className="text-xl font-semibold text-blue-600">Edit Product</h2>
  <div className="flex flex-wrap gap-4 items-end">
    <div>
      <span>Select Product:</span>
      <select 
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={selectedProductId}
        onChange={(e) => handleSelectProduct(e.target.value)}
      >
        <option value="">-- Choose Product --</option>
        {rows.map(r => (
          <option key={r.id} value={r.id}>{r.category} - {r.product}</option>
        ))}
      </select>
    </div>

    {selectedProductId && (
      <>
        <div>
          <span>New Name:</span>
          <Input 
            value={editForm.name} 
            onChange={e => setEditForm({...editForm, name: e.target.value})} 
          />
        </div>
        <div>
          <span>New Price:</span>
          <Input 
            type="number"
            value={editForm.price} 
            onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} 
          />
        </div>
        <div>
          <span>New Count:</span>
          <Input 
            type="number"
            value={editForm.count} 
            onChange={e => setEditForm({...editForm, count: Number(e.target.value)})} 
          />
        </div>
        <Button onClick={handleUpdate} disabled={loading}>Update Changes</Button>
      </>
    )}
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
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.category}</TableCell>
                    <TableCell>{r.product}</TableCell>
                    <TableCell>{r.count}</TableCell>
                    <TableCell>{r.price}</TableCell>
                    <TableCell className="text-right">
                      {r.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      {loading ? "Loading..." : "No products yet"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>total</TableCell>
                  <TableCell className="text-right">
                    {grandTotal.toFixed(2)}
                  </TableCell>
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
