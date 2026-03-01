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
const WarehouseSchema = z.object({
  warehouseLocation: z.string().min(3, "Location required"),
  warehouseName: z.string().min(2, "Warehouse name required"),
  stock: z.coerce.number().min(0),
  alertStock: z.coerce.number().min(0),
  product: z.string().min(1, "Product required"),
  isActive: z.boolean(),
});

export default function CreateWearhouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [editSlug, setEditSlug] = useState(null);

  const form = useForm({
    resolver: zodResolver(WarehouseSchema),
    defaultValues: {
      warehouseLocation: "",
      warehouseName: "",
      stock: 0,
      alertStock: 0,
      product: "",
      isActive: true,
    },
  });

  // ---------------- GET ALL ----------------
  const getWarehouse = async () => {
    const res = await api.get("/wearhouse/getall-wearhouse");
    setWarehouses(res.data.data || []);
  };

  useEffect(() => {
    getWarehouse();
  }, []);

  // ---------------- SUBMIT ----------------
  const onSubmit = async (values) => {
    const token = localStorage.getItem("accessToken");

    try {
      if (!editSlug) {
        await api.post("/wearhouse/create-wearhouse", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/wearhouse/update-wearhouse/${editSlug}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditSlug(null);
      }

      form.reset();
      getWarehouse();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item) => {
    setEditSlug(item.slug);
    form.reset({
      ...item,
    });
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (slug) => {
    const token = localStorage.getItem("accessToken");

    await api.delete(`/wearhouse/delete-wearhouse/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    getWarehouse();
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
            {...form.register("warehouseName")}
            placeholder="Warehouse Name"
          />

          <Input
            {...form.register("warehouseLocation")}
            placeholder="Warehouse Location"
          />

          <Input
            type="number"
            {...form.register("stock")}
            placeholder="Total Stock"
          />

          <Input
            type="number"
            {...form.register("alertStock")}
            placeholder="Alert Stock"
          />

          <Input {...form.register("product")} placeholder="Product ID" />

          <div className="flex items-center gap-2">
            <input type="checkbox" {...form.register("isActive")} />
            <label>Active</label>
          </div>

          <Button type="submit">
            {editSlug ? "Update Warehouse" : "Create Warehouse"}
          </Button>
        </form>
      </Form>

      {/* -------- TABLE -------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Alert Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {warehouses.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.warehouseName}</TableCell>
              <TableCell>{item.warehouseLocation}</TableCell>
              <TableCell>
                {item.stock}
                {item.stock <= item.alertStock && (
                  <span className="text-red-500 ml-2">
                    ⚠ Low Stock
                  </span>
                )}
              </TableCell>
              <TableCell>{item.alertStock}</TableCell>
              <TableCell>
                {item.isActive ? "Active ✅" : "Inactive ❌"}
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