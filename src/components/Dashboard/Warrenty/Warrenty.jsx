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
const WarrantySchema = z.object({
  warrantyValidFrom: z.string().min(1),
  warrantyValidTo: z.string().min(1),
  warrantyDurationDay: z.coerce.number().min(0),
  warrantyDurationMonth: z.coerce.number().min(0),
  warrantyDurationYear: z.coerce.number().min(0),
  warrantyPolicy: z.string().min(5),
  product: z.string().min(1),
});

export default function CreateWarrenty() {
  const [warranties, setWarranties] = useState([]);
  const [editSlug, setEditSlug] = useState(null);

  const form = useForm({
    resolver: zodResolver(WarrantySchema),
    defaultValues: {
      warrantyValidFrom: "",
      warrantyValidTo: "",
      warrantyDurationDay: 0,
      warrantyDurationMonth: 0,
      warrantyDurationYear: 0,
      warrantyPolicy: "",
      product: "",
    },
  });

  // ---------------- GET ALL ----------------
  const getWarranty = async () => {
    const res = await api.get("/warrenty/getall-warrenty");
    setWarranties(res.data.data || []);
  };

  useEffect(() => {
    getWarranty();
  }, []);

  // ---------------- SUBMIT ----------------
  const onSubmit = async (values) => {
    const token = localStorage.getItem("accessToken");

    try {
      if (!editSlug) {
        await api.post("/warrenty/create-warrenty", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/warrenty/update-warrenty/${editSlug}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditSlug(null);
      }

      form.reset();
      getWarranty();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item) => {
    setEditSlug(item.slug);
    form.reset({
      ...item,
      warrantyValidFrom: item.warrantyValidFrom?.split("T")[0],
      warrantyValidTo: item.warrantyValidTo?.split("T")[0],
    });
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (slug) => {
    const token = localStorage.getItem("accessToken");
    await api.delete(`/warrenty/delete-warrenty/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getWarranty();
  };

  return (
    <div className="p-6 space-y-10">
      {/* -------- FORM -------- */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 border p-4 rounded-lg"
        >
          <Input
            type="date"
            {...form.register("warrantyValidFrom")}
            placeholder="Valid From"
          />

          <Input
            type="date"
            {...form.register("warrantyValidTo")}
            placeholder="Valid To"
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              {...form.register("warrantyDurationDay")}
              placeholder="Day"
            />
            <Input
              type="number"
              {...form.register("warrantyDurationMonth")}
              placeholder="Month"
            />
            <Input
              type="number"
              {...form.register("warrantyDurationYear")}
              placeholder="Year"
            />
          </div>

          <Input {...form.register("product")} placeholder="Product ID" />

          <textarea
            {...form.register("warrantyPolicy")}
            className="border rounded p-2 w-full"
            placeholder="Warranty Policy"
          />

          <Button type="submit">
            {editSlug ? "Update Warranty" : "Create Warranty"}
          </Button>
        </form>
      </Form>

      {/* -------- TABLE -------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Valid From</TableHead>
            <TableHead>Valid To</TableHead>
            <TableHead>Policy</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {warranties.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                {item.product && typeof item.product === "object"
                  ? item.product?.name || "No Name"
                  : item.product || "N/A"}
              </TableCell>
              <TableCell>
                {item.warrantyDurationYear}Y {item.warrantyDurationMonth}M{" "}
                {item.warrantyDurationDay}D
              </TableCell>
              <TableCell>
                {new Date(item.warrantyValidFrom).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(item.warrantyValidTo).toLocaleDateString()}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {item.warrantyPolicy || "N/A"}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(item.slug)}
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
