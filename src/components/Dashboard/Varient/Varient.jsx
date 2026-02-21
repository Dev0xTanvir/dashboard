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
const VariantSchema = z.object({
  variantName: z.string().min(1),
  product: z.string().min(1),
  sku: z.string().min(1),
  barCode: z.string().optional(),
  qrCode: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  stockVariant: z.coerce.number().min(0),
  alertVariantStock: z.coerce.number().min(0),
  purchasePrice: z.coerce.number().min(0),
  retailPrice: z.coerce.number().min(0),
  wholeSalePrice: z.coerce.number().optional(),
  stockAlert: z.boolean().optional(),
  instock: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export default function CreateVariant() {
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [editSlug, setEditSlug] = useState(null);

  const form = useForm({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      variantName: "",
      product: "",
      sku: "",
      barCode: "",
      qrCode: "",
      size: "",
      color: "",
      stockVariant: 0,
      alertVariantStock: 0,
      purchasePrice: 0,
      retailPrice: 0,
      wholeSalePrice: "",
      stockAlert: false,
      instock: true,
      isActive: true,
    },
  });

  // ---------------- GET ALL ----------------
  const getVariants = async () => {
    const res = await api.get("/variant/getall-variant");
    setVariants(res.data.data || []);
  };

  useEffect(() => {
    getVariants();
  }, []);

  // ---------------- SUBMIT ----------------
  const onSubmit = async (values) => {
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === "size" || key === "color") {
        value &&
          value.split(",").forEach((v) => formData.append(key, v.trim()));
      } else {
        formData.append(key, value);
      }
    });

    images.forEach((img) => formData.append("image", img));

    try {
      if (!editSlug) {
        await api.post("/variant/create-variant", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/variant/update-variant/${editSlug}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditSlug(null);
      }

      form.reset();
      setImages([]);
      getVariants();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item) => {
    setEditSlug(item.slug);
    form.reset({
      ...item,
      size: item.size?.join(","),
      color: item.color?.join(","),
    });
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (slug) => {
    const token = localStorage.getItem("accessToken");
    await api.delete(`/variant/delete-variant/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getVariants();
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
            name="variantName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variant Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Input {...form.register("product")} placeholder="Product ID" />
          <Input {...form.register("sku")} placeholder="SKU" />

          <div className="grid grid-cols-2 gap-4">
            <Input {...form.register("barCode")} placeholder="Barcode" />
            <Input {...form.register("qrCode")} placeholder="QR Code" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input {...form.register("size")} placeholder="Sizes (S,M,L)" />
            <Input
              {...form.register("color")}
              placeholder="Colors (Red,Blue)"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              {...form.register("purchasePrice")}
              placeholder="Purchase"
            />
            <Input
              type="number"
              {...form.register("retailPrice")}
              placeholder="Retail"
            />
            <Input
              type="number"
              {...form.register("wholeSalePrice")}
              placeholder="Wholesale"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              {...form.register("stockVariant")}
              placeholder="Stock"
            />
            <Input
              type="number"
              {...form.register("alertVariantStock")}
              placeholder="Alert Stock"
            />
          </div>

          <Input
            type="file"
            multiple
            onChange={(e) => setImages([...e.target.files])}
          />

          <Button type="submit">
            {editSlug ? "Update Variant" : "Create Variant"}
          </Button>
        </form>
      </Form>

      {/* -------- TABLE -------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {variants.map((item) => (
            <TableRow key={item._id}>
              {/* 🔥🔥 IMAGE UI RENDER */}
              <TableCell>
                {item.image?.length > 0 ? (
                  <img
                    src={item.image[0].secure_url}
                    alt={item.variantName}
                    className="h-14 w-14 object-cover rounded border"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </TableCell>
              <TableCell>{item.variantName}</TableCell>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.stockVariant}</TableCell>
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
