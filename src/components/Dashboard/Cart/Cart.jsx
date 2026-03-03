import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "../../../Utils/axios";

// ---------------- SCHEMA ----------------
const CartSchema = z.object({
  guestId: z.string().min(1),
  product: z.string().optional(),
  variant: z.string().min(1),
  quantity: z.coerce.number().min(1),
  size: z.string().optional(),
  color: z.string().optional(),
  coupon: z.string().optional(),
});

export default function CreateCart() {
  const [carts, setCarts] = useState([]);
  const [editId, setEditId] = useState(null);

  const form = useForm({
    resolver: zodResolver(CartSchema),
    defaultValues: {
      guestId: "",
      product: "",
      variant: "",
      quantity: 1,
      size: "",
      color: "",
      coupon: "",
    },
  });

  // ---------------- AUTO GUEST ID ----------------
  useEffect(() => {
    let id = localStorage.getItem("guestId");

    if (!id) {
      id = "guest-" + Date.now();
      localStorage.setItem("guestId", id);
    }

    form.setValue("guestId", id);
    getCart(id);
  }, []);

  // ---------------- GET CART ----------------
  const getCart = async (id) => {
    if (!id) return;

    try {
      const res = await api.get("/cart/getcart", {
        params: { guestId: id },
        headers: { "Cache-Control": "no-cache" },
      });

      const cartData = res.data?.data;

      if (cartData && Array.isArray(cartData.items)) {
        setCarts(cartData.items);
      } else {
        setCarts([]);
      }
    } catch (err) {
      console.error(err);
      setCarts([]);
    }
  };

  // ---------------- SUBMIT ----------------
  const onSubmit = async (values) => {
    try {
      if (!editId) {
        await api.post("/cart/addtocart", values);
      } else {
        await api.put(`/cart/updatecart/${editId}`, values);
        setEditId(null);
      }

      getCart(values.guestId);
      form.reset({ ...values, quantity: 1 });
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item) => {
    setEditId(item._id);

    form.reset({
      guestId: form.getValues("guestId"),
      product: item.product?._id || "",
      variant: item.variant?._id || "",
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      coupon: item.couponCode || "",
    });
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (cartItemId) => {
    try {
      await api.delete("/cart/deletecart", {
        data: {
          cartItemId,
          guestId: form.getValues("guestId"),
        },
      });

      getCart(form.getValues("guestId"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 border p-4 rounded-lg"
        >
          <Input {...form.register("guestId")} placeholder="Guest ID" />
          <Input {...form.register("product")} placeholder="Product ID" />
          <Input {...form.register("variant")} placeholder="Variant ID" />
          <Input
            type="number"
            {...form.register("quantity")}
            placeholder="Quantity"
          />
          <Input {...form.register("size")} placeholder="Size" />
          <Input {...form.register("color")} placeholder="Color" />
          <Input {...form.register("coupon")} placeholder="Coupon Code" />

          <Button type="submit">
            {editId ? "Update Cart Item" : "Add To Cart"}
          </Button>
        </form>
      </Form>

      {/* ---------------- TABLE ---------------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Variant</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {carts.length > 0 ? (
            carts.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.size || "-"}</TableCell>
                <TableCell>{item.color || "-"}</TableCell>
                <TableCell>{item.totalPrice}</TableCell>

                <TableCell className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500"
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No Cart Items
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
