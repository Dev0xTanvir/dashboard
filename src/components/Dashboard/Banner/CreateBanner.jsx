"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "../../../Utils/axios";

// Schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().url("Invalid link").optional(),
  position: z.string().min(1, "Position is required"),
  image: z.any().optional(),
});

export function CreateBanner() {
  const [banners, setBanners] = useState([]);
  const [editslug, seteditslug] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      link: "",
      position: "",
      image: null,
    },
  });

  // Fetch all banners
  const fetchBanners = async () => {
    const res = await api.get("/banner/getall-banner");
    setBanners(res.data.data);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Submit create/update
  async function onSubmit(values) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("link", values.link || "");
    formData.append("position", values.position);
    if (values.image) formData.append("image", values.image);

    if (!editslug) {
    const response =  await api.post("/banner/create-banner", formData);
    console.log(response)
    } else {
      await api.put(`/banner/update-banner/${editslug}`, formData);
      seteditslug(null);
    }

    form.reset();
    fetchBanners();
  }


  // Edit
  const handleEdit = (item) => {
    seteditslug(item.slug);
    form.setValue("title", item.title);
    form.setValue("link", item.link);
    form.setValue("position", item.position);
    form.setValue("image", null);
  };

  // Delete
  const handleDelete = async (slug) => {
    await api.delete(`/banner/delete-banner/${slug}`);
    fetchBanners();
  };

  return (
    <div className="p-6 space-y-10">
      {/* CREATE / UPDATE FORM */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border p-6 rounded-xl shadow"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Banner Title" {...field} />
                </FormControl>
                <FormDescription>Enter banner title</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="1, 2, 3..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {editslug ? "Update Banner" : "Create Banner"}
          </Button>
        </form>
      </Form>

      {/* BANNER LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((item) => (
          <div
            key={item._id}
            className="border p-4 rounded-xl shadow space-y-2"
          >
            <img
              src={item.image}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="font-bold">{item.title}</h2>
            <p>Link: {item.link}</p>
            <p>Position: {item.position}</p>

            <div className="flex gap-3">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateBanner;
