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
import { useAuth } from "@clerk/clerk-react"; // استيراد مهم

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

const API = window.location.origin;

export default function CategoryPage() {
  const { userId } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    categoryName: "",
    productName: "",
    count: 0,
    price: 0,
  });

  // Load Data
  const load = async () => {
    if (!userId) return; // حماية
    setLoading(true);
    try {
      // 2. إرسال userId في الرابط
      const res = await fetch(`${API}/api/categories?userId=${userId}`);
      const data: Category[] = await res.json();
      
      const normalized = data.map((c) => ({
        ...c,
        products: c.products.map((p) => ({
          ...p,
          price: typeof p.price === "string" ? Number(p.price) : p.price,
        })),
      }));

      setCategories(normalized);
    } catch (error) {
      console.error("Failed to load", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      load();
    }
  }, [userId]);

  // Handle Submit (Create)
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Please sign in");

    const catName = form.categoryName.trim();
    const prodName = form.productName.trim();
    const price = Number(form.price);
    const count = Number(form.count);

    if (!catName || !prodName) return alert("enter category or product name");
    if (price < 0 || count < 0) return alert("dont enter negative numbers");

    setLoading(true);
    try {
      let category = categories.find(
        (c) => c.name.toLowerCase() === catName.toLowerCase()
      );

      // Create Category if not exists
      if (!category) {
        const createCat = await fetch(`${API}/api/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: catName, 
            userId: userId // 3. إرسال userId عند الإنشاء
          }),
        });
        if (!createCat.ok) throw new Error("failed create category");
        category = await createCat.json();
      }

      // Create Product
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
      alert(err.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Calculations for Table
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

  // Delete Logic
  const [deleteName, setDeleteName] = useState("");
  const handleDelete = async (type: "category" | "product") => {
    if (!deleteName.trim()) return alert("Please enter a name to delete");
    if (!userId) return;

    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    setLoading(true);
    try {
      // 4. إرسال userId عند الحذف (مهم جداً للـ Category)
      const endpoint =
        type === "category"
          ? `${API}/api/categories/name/${deleteName}?userId=${userId}`
          : `${API}/api/products/name/${deleteName}`; // المنتج يحذف بالاسم فقط حالياً حسب كودك القديم

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

  // Edit Logic
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
    const [catId, prodId] = selectedProductId.split("-");

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

  // Render
 return (
  <>
    <div className="w-full pb-24 md:pb-10">
      <Header />
      <div className="px-4 md:px-10">
        <h1 className="mt-9 font-bold text-[24px] md:text-[30px] text-center md:text-left">Category</h1>
        
        <div className="mt-9">
          <Form id="inputs_category" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm font-medium">Add Category :</span>
                <Input
                  type="text"
                  placeholder="Enter Category here"
                  value={form.categoryName}
                  onChange={(e) => setForm((f) => ({ ...f, categoryName: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium">Add Product :</span>
                <Input
                  type="text"
                  placeholder="Enter your Product here"
                  value={form.productName}
                  onChange={(e) => setForm((f) => ({ ...f, productName: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm font-medium">Count Of Product :</span>
                <Input
                  type="number"
                  placeholder="Number Of Products"
                  value={form.count}
                  onChange={(e) => setForm((f) => ({ ...f, count: Number(e.target.value) || 0 }))}
                  min={0}
                />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium">Price :</span>
                <Input
                  type="number"
                  placeholder="Enter Product Price"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))}
                  min={0}
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full md:w-auto px-10">
              Confirm {loading ? "Saving..." : "Save"}
            </Button>
          </Form>
        </div>

        <div className="p-4 border rounded-lg bg-red-50/10 mt-6">
          <h2 className="text-xl font-semibold text-red-600 mb-3">Delete Items</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <span className="text-sm">Enter Name to Delete:</span>
              <Input
                type="text"
                placeholder="Category or product Name"
                value={deleteName}
                onChange={(e) => setDeleteName(e.target.value)}
                className="border-red-300"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="destructive"
                onClick={() => handleDelete("product")}
                disabled={loading}
                className="flex-1"
              >
                Delete Product
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete("category")}
                disabled={loading}
                className="flex-1"
              >
                Delete Category
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-blue-50/10 mt-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">Edit Product</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <span className="text-sm">Select Product:</span>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedProductId}
                onChange={(e) => handleSelectProduct(e.target.value)}
              >
                <option value="">-- Choose Product --</option>
                {rows.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.category} - {r.product}
                  </option>
                ))}
              </select>
            </div>

            {selectedProductId && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <span className="text-xs">New Name:</span>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs">New Price:</span>
                  <Input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs">New Count:</span>
                  <Input
                    type="number"
                    value={editForm.count}
                    onChange={(e) => setEditForm({ ...editForm, count: Number(e.target.value) })}
                  />
                </div>
                <Button onClick={handleUpdate} disabled={loading} className="w-full">
                  Update
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-9 overflow-x-auto rounded-lg border shadow-sm" id="tabels">
          <Table>
            <TableCaption>A list of your products and categories.</TableCaption>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="min-w-[120px]">Category</TableHead>
                <TableHead className="min-w-[120px]">Products</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{r.category}</TableCell>
                  <TableCell>{r.product}</TableCell>
                  <TableCell>{r.count}</TableCell>
                  <TableCell>{r.price}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {r.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    {loading ? "Loading..." : "No products yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter className="bg-gray-100 font-bold">
              <TableRow>
                <TableCell colSpan={4}>Grand Total</TableCell>
                <TableCell className="text-right text-blue-600">
                  {grandTotal.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      <div className="px-4 md:px-10 mt-10 space-y-10">
        <div id="contact-us"><Contactus /></div>
        <div id="about"><About /></div>
      </div>
    </div>
  </>
)};