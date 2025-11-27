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
import { useGetAllCategory, useGetAllSubCategory } from "../../Api/Api";

// ------------------- ZOD SCHEMA -------------------
const SubCategorySchema = z.object({
  name: z.string().min(1, "Sub category name required"),
  category: z.string().min(1, "Select a category"),
});

// --------------------------------------------------
export function CreateSubCategory() {
  const [editId, setEditId] = useState(null);

  const { data: categories = [] } = useGetAllCategory();
  const {
    data: subCats = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllSubCategory();

  const form = useForm({
    resolver: zodResolver(SubCategorySchema),
    defaultValues: {
      name: "",
      category: "",
    },
  });

  // -------------------- SUBMIT ------------------------
  async function onSubmit(values) {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    try {
      if (!editId) {
        await api.post("/subcategory/create-subcategory", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/subcategory/update-subcategory/${editId}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditId(null);
      }

      form.reset();
      refetch();
    } catch (err) {
      console.error("Submit error:", err);
    }
  }

  // -------------------- EDIT --------------------------
  const handleEdit = (item) => {
    setEditId(item._id);
    form.setValue("name", item.name);
    form.setValue("category", item.category?._id);
  };

  // -------------------- DELETE ------------------------
  const handleDelete = async (id) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    try {
      await api.delete(`/subcategory/delete-subcategory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refetch();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // -------------------- LOADING -----------------------
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load ❌</p>;
  }

  return (
    <div className="p-6 space-y-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 border p-4 rounded-lg"
        >
          {/* NAME */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: HP Laptop" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CATEGORY SELECT */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Category</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Choose one</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {editId ? "Update Sub Category" : "Create Sub Category"}
          </Button>
        </form>
      </Form>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {subCats.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>

              <TableCell>{item.category?.name}</TableCell>

              <TableCell className="flex gap-3">
                <Button
                  className="bg-yellow-500"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </Button>

                <Button
                  className="bg-red-600"
                  onClick={() => handleDelete(item._id)}
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

export default CreateSubCategory;
