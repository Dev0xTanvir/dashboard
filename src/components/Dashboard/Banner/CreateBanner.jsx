"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import axios from "axios";

// ! New Correct Schema

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().url("Invalid link").optional(),
  position: z.string().min(1, "Position is required"),
  image: z.any().optional(),
});

export function CreateBanner() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      link: "",
      position: "",
      image: null,
    },
  });

    //  ! create banner data fetch axios

  async function onSubmit(values) {
    console.log("Final Form Values:", values);

    const formData = new FormData();

    // Append form fields
    formData.append("title", values.title || "");
    formData.append("link", values.link || "");
    formData.append("position", values.position || "");
    formData.append("image", values.image); // File object

    try {
      const respons = await axios.post(
        "http://localhost:3000/api/v1/banner/create-banner",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", respons.data);
    } catch (error) {
      console.log("Upload error:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
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

        {/* Link */}
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>The URL for the banner</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Position */}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="1, 2, 3..." {...field} />
              </FormControl>
              <FormDescription>Banner position</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormDescription>Upload banner image</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
