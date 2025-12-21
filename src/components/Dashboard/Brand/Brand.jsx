import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
import { useGetAllBrand } from "../../Api/Api";

// ---------------- SCHEMA ----------------
const BrandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  image: z.any().optional(),
});

export function CreateBrand() {
  const [editSlug, setEditSlug] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    data: brands = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllBrand();

  const form = useForm({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      name: "",
      image: null,
    },
  });

  // ---------------- SUBMIT ----------------
  async function onSubmit(values) {
    const formData = new FormData();
    formData.append("name", values.name);

    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    const token = JSON.parse(localStorage.getItem("accessToken"));

    try {
      if (!editSlug) {
        await api.post("/brand/create-brand", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/brand/update-brand/${editSlug}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditSlug(null);
      }

      form.reset();
      setPreview(null);
      refetch();
    } catch (err) {
      console.error("Submit error:", err);
    }
  }

  // ---------------- EDIT ----------------
  const handleEdit = (item) => {
    setEditSlug(item.slug);
    form.setValue("name", item.name);
    form.setValue("image", undefined);
    setPreview(item.image?.secure_url);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (slug) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    try {
      await api.delete(`/brand/delete-brand/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refetch();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ---------------- LOADING ----------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-300 border-t-transparent"></div>
      </div>
    );
  }

  // ---------------- ERROR ----------------
  if (isError) {
    return <p className="text-center text-red-500">Failed to load ❌</p>;
  }

  return (
    <div className="p-6 space-y-10">
      {/* -------- FORM -------- */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 border p-4 rounded-lg"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <Input placeholder="Brand name (ex: nike)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* LOGO */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Logo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </FormControl>

                {preview && (
                  <img
                    src={preview}
                    className="w-28 h-28 object-contain rounded mt-2 border"
                  />
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {editSlug ? "Update Brand" : "Create Brand"}
          </Button>
        </form>
      </Form>

      {/* -------- TABLE -------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {brands.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <img
                  src={item.image?.secure_url}
                  className="w-20 h-16 object-contain rounded"
                />
              </TableCell>

              <TableCell>{item.name}</TableCell>

              <TableCell className="flex gap-3">
                <Button
                  className="bg-yellow-500"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </Button>

                <Button
                  className="bg-red-600"
                  onClick={() => handleDelete(item.slug)}
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

export default CreateBrand;
