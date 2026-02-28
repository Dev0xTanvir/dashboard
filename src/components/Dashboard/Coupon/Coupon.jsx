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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "../../../Utils/axios";

// ---------------- SCHEMA ----------------
const CouponSchema = z.object({
  code: z.string().min(1),
  discountType: z.enum(["percentage", "tk"]),
  discountValue: z.coerce.number().min(0),
  expireAt: z.string().min(1),
  usageLimit: z.coerce.number().min(1),
  usedCount: z.coerce.number().min(0),
});

export default function CreateCoupon() {
  const [coupons, setCoupons] = useState([]);
  const [editId, setEditId] = useState(null);

  const form = useForm({
    resolver: zodResolver(CouponSchema),
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: 0,
      expireAt: "",
      usageLimit: 1,
      usedCount: 0,
    },
  });

  // ---------------- GET ALL ----------------
  const getCoupons = async () => {
    const res = await api.get("/copun/getall-copun");
    setCoupons(res.data.data || []);
  };

  useEffect(() => {
    getCoupons();
  }, []);

  // ---------------- SUBMIT ----------------
  const onSubmit = async (values) => {
    const token = localStorage.getItem("accessToken");

    try {
      if (!editId) {
        await api.post("/copun/create-copun", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/copun/update-copun/${editId}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditId(null);
      }

      form.reset();
      getCoupons();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item) => {
    setEditId(item._id);
    form.reset({
      ...item,
      expireAt: item.expireAt?.split("T")[0],
    });
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    await api.delete(`/copun/delete-copun/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getCoupons();
  };

  return (
    <div className="p-6 space-y-10">
      {/* -------- FORM -------- */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 border p-4 rounded-lg"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <select
            {...form.register("discountType")}
            className="border p-2 rounded"
          >
            <option value="percentage">Percentage</option>
            <option value="tk">TK</option>
          </select>

          <Input
            type="number"
            {...form.register("discountValue")}
            placeholder="Discount Value"
          />

          <Input type="date" {...form.register("expireAt")} />

          <Input
            type="number"
            {...form.register("usageLimit")}
            placeholder="Usage Limit"
          />

          <Input
            type="number"
            {...form.register("usedCount")}
            placeholder="Used Count"
          />

          <Button type="submit">
            {editId ? "Update Coupon" : "Create Coupon"}
          </Button>
        </form>
      </Form>

      {/* -------- TABLE -------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Expire</TableHead>
            <TableHead>Used</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {coupons.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.discountType}</TableCell>
              <TableCell>{item.discountValue}</TableCell>
              <TableCell>
                {new Date(item.expireAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {item.usedCount} / {item.usageLimit}
              </TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
