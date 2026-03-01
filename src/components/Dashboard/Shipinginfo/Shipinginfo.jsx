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
const ImportSchema = z.object({
  importDestination: z.string().min(3, "Destination required"),
  importerInfo: z.string().min(5, "Importer info required"),
  maxShipmentDuration: z.coerce.number().min(0),
  shippingCharge: z.coerce.number().min(0),
  shippingDutyCost: z.coerce.number().min(0),
  product: z.string().min(1, "Product required"),
  isActive: z.boolean(),
});

export default function CreateShipinginfo() {
  const [imports, setImports] = useState([]);
  const [editSlug, setEditSlug] = useState(null);

  const form = useForm({
    resolver: zodResolver(ImportSchema),
    defaultValues: {
      importDestination: "",
      importerInfo: "",
      maxShipmentDuration: 0,
      shippingCharge: 0,
      shippingDutyCost: 0,
      product: "",
      isActive: true,
    },
  });

  // ---------------- GET ALL ----------------
  const getImport = async () => {
    const res = await api.get("/shipinginfo/getall-shiping");
    setImports(res.data.data || []);
  };

  useEffect(() => {
    getImport();
  }, []);

  // ---------------- SUBMIT ----------------
  const onSubmit = async (values) => {
    const token = localStorage.getItem("accessToken");

    try {
      if (!editSlug) {
        await api.post("/shipinginfo/create-shiping", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/shipinginfo/update-shiping/${editSlug}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditSlug(null);
      }

      form.reset();
      getImport();
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

    await api.delete(`/shipinginfo/delete-shiping/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    getImport();
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
            {...form.register("importDestination")}
            placeholder="Import Destination"
          />

          <Input
            {...form.register("importerInfo")}
            placeholder="Importer Info"
          />

          <Input
            type="number"
            {...form.register("maxShipmentDuration")}
            placeholder="Max Shipment Duration (Days)"
          />

          <Input
            type="number"
            {...form.register("shippingCharge")}
            placeholder="Shipping Charge"
          />

          <Input
            type="number"
            {...form.register("shippingDutyCost")}
            placeholder="Shipping Duty Cost"
          />

          <Input {...form.register("product")} placeholder="Product ID" />

          <div className="flex items-center gap-2">
            <input type="checkbox" {...form.register("isActive")} />
            <label>Active</label>
          </div>

          <Button type="submit">
            {editSlug ? "Update Import" : "Create Import"}
          </Button>
        </form>
      </Form>

      {/* -------- TABLE -------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Destination</TableHead>
            <TableHead>Importer</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Shipping</TableHead>
            <TableHead>Duty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {imports.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.importDestination}</TableCell>
              <TableCell>{item.importerInfo}</TableCell>
              <TableCell>{item.maxShipmentDuration} Days</TableCell>
              <TableCell>{item.shippingCharge}৳</TableCell>
              <TableCell>{item.shippingDutyCost}৳</TableCell>
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