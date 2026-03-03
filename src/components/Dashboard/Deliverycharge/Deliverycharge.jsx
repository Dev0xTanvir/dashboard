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
const DeliverySchema = z.object({
  name: z.string().min(2, "Delivery name required"),
  deliveryCharge: z.coerce.number().min(0, "Charge required"),
  description: z.string().optional(),
});

export default function CreateDeliverycharge() {
  const [deliveries, setDeliveries] = useState([]);
  const [editSlug, setEditSlug] = useState(null);

  const form = useForm({
    resolver: zodResolver(DeliverySchema),
    defaultValues: {
      name: "",
      deliveryCharge: 0,
      description: "",
    },
  });

  // ---------------- GET ALL ----------------
  const getDelivery = async () => {
    const res = await api.get("/deliverycharge/getalldelivery-create");
    setDeliveries(res.data.data || []);
  };

  useEffect(() => {
    getDelivery();
  }, []);

  // ---------------- SUBMIT ----------------
  const onSubmit = async (values) => {
    const token = localStorage.getItem("accessToken");

    try {
      if (!editSlug) {
        await api.post("/deliverycharge/deliverycharge-create", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(
          `/deliverycharge/updatedelivery-create/${editSlug}`,
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setEditSlug(null);
      }

      form.reset();
      getDelivery();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item) => {
    setEditSlug(item.slug); // 🔥 slug used
    form.reset({
      name: item.name,
      deliveryCharge: item.deliveryCharge,
      description: item.description,
    });
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (slug) => {
    const token = localStorage.getItem("accessToken");

    await api.delete(`/deliverycharge/deletedelivery-create/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    getDelivery();
  };

  return (
    <div className="p-6 space-y-10">
      {/* -------- FORM -------- */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 border p-4 rounded-lg"
        >
          <Input {...form.register("name")} placeholder="Delivery Name" />

          <Input
            type="number"
            {...form.register("deliveryCharge")}
            placeholder="Delivery Charge"
          />

          <Input {...form.register("description")} placeholder="Description" />

          <Button type="submit">
            {editSlug ? "Update Delivery" : "Create Delivery"}
          </Button>
        </form>
      </Form>

      {/* -------- TABLE -------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Charge</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {deliveries.length > 0 ? (
            deliveries.map((item) => (
              <TableRow key={item.slug}>
                <TableCell>{item.name}</TableCell>
                <TableCell>৳ {item.deliveryCharge}</TableCell>
                <TableCell>{item.description}</TableCell>
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No Delivery Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
