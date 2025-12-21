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
import { useGetAllDiscount } from "../../Api/Api";

// ---------------- SCHEMA ----------------
const DiscountSchema = z.object({
  discountName: z.string().min(1, "Discount name is required"),
  discountValidFrom: z.string().min(1),
  discountValidTo: z.string().min(1),
  discountType: z.enum(["taka", "percentage"]),
  discountValueByAmount: z.coerce.number().min(1),
  discountValueByPercentage: z.coerce.number().min(1).optional(),
  discountPlan: z.enum(["category", "subCategory", "product"]),
  subCategory: z.string().optional(),
});

export function CreateDiscount() {
  const [editSlug, setEditSlug] = useState(null);

  const {
    data: discounts = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllDiscount();

  const form = useForm({
    resolver: zodResolver(DiscountSchema),
    defaultValues: {
      discountName: "",
      discountValidFrom: "",
      discountValidTo: "",
      discountType: "taka",
      discountValueByAmount: "",
      discountValueByPercentage: "",
      discountPlan: "subCategory",
      subCategory: "",
      category: "",
      product: "",
    },
  });

  // ---------------- SUBMIT ----------------
  async function onSubmit(values) {
    //  Prepare payload based on discountType
    const payload = { ...values };
    if (values.discountType === "taka") {
      delete payload.discountValueByPercentage;
    } else if (values.discountType === "percentage") {
      delete payload.discountValueByAmount;
    }

    const token = JSON.parse(localStorage.getItem("accessToken"));

    try {
      if (!editSlug) {
        await api.post("/discount/discount-create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/discount/updatediscount-create/${editSlug}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditSlug(null);
      }

      form.reset();
      refetch();
    } catch (err) {
      console.error("Submit error:", err);
    }
  }

  // ---------------- EDIT ----------------
  const handleEdit = (item) => {
    setEditSlug(item.slug);
    form.reset({
      discountName: item.discountName,
      discountValidFrom: item.discountValidFrom.slice(0, 10),
      discountValidTo: item.discountValidTo.slice(0, 10),
      discountType: item.discountType,
      discountValueByAmount: item.discountValueByAmount,
      discountValueByPercentage: item.discountValueByPercentage,
      discountPlan: item.discountPlan,
      subCategory: item.subCategory,
      category: item.category,
      product: item.product,
    });
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (slug) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    try {
      await api.delete(`/discount/deletediscount-create/${slug}`, {
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
            name="discountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Name</FormLabel>
                <FormControl>
                  <Input placeholder="ex: tanvir vai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="discountValidFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid From</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountValidTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid To</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <FormControl>
                  <select {...field} className="w-full border rounded p-2">
                    <option value="taka">Taka</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* -------- Taka / Percentage Inputs -------- */}
          <FormField
            control={form.control}
            name="discountValueByAmount"
            render={({ field }) => {
              const type = form.watch("discountType");
              if (type !== "taka") return null;
              return (
                <FormItem>
                  <FormLabel>Discount Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="ex: 200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="discountValueByPercentage"
            render={({ field }) => {
              const type = form.watch("discountType");
              if (type !== "percentage") return null;
              return (
                <FormItem>
                  <FormLabel>Discount Percentage</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="ex: 15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="discountPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Plan</FormLabel>
                <FormControl>
                  <select {...field} className="w-full border rounded p-2">
                    <option value="category">Category</option>
                    <option value="subCategory">Sub Category</option>
                    <option value="product">Product</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={form.watch("discountPlan")}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch("discountPlan") === "category"
                    ? "Category ID"
                    : form.watch("discountPlan") === "subCategory"
                    ? "Subcategory ID"
                    : "Product ID"}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter ID" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit">
            {editSlug ? "Update Discount" : "Create Discount"}
          </Button>
        </form>
      </Form>

      {/* -------- TABLE -------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Valid</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {discounts.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.discountName}</TableCell>
              <TableCell>{item.discountType}</TableCell>
              <TableCell>
                {item.discountType === "taka"
                  ? item.discountValueByAmount
                  : item.discountValueByPercentage + "%"}{" "}
              </TableCell>
              <TableCell>
                {item.discountValidFrom.slice(0, 10)} →{" "}
                {item.discountValidTo.slice(0, 10)}
              </TableCell>
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

export default CreateDiscount;
