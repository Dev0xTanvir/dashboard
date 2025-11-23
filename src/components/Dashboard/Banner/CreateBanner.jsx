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

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  image: z.any().optional(),
});

export function CreateBanner() {
  const [banners, setBanners] = useState([]);
  const [editslug, seteditslug] = useState(null);
  const [preview, setPreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      link: "",
      position: "",
      image: null,
    },
  });

  const fetchBanners = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));
      const res = await api.get("/banner/getall-banner", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      setBanners(res.data.data);
    } catch (err) {
      console.error("Fetch banners error:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  async function onSubmit(values) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("link", values.link ?? "");
    formData.append("position", values.position);

    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    const accessToken = JSON.parse(localStorage.getItem("accessToken"));

    try {
      if (!editslug) {
        await api.post("/banner/create-banner", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
      } else {
        await api.put(`/banner/update-banner/${editslug}`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        seteditslug(null);
      }

      form.reset();
      setPreview(null);
      fetchBanners();
    } catch (err) {
      console.error("Banner submit error:", err);
    }
  }

  const handleEdit = (item) => {
    seteditslug(item.slug);
    form.setValue("title", item.title);
    form.setValue("link", item.link);
    form.setValue("position", item.position);
    form.setValue("image", undefined);
    setPreview(item.image?.[0]?.secure_url);
  };

  const handleDelete = async (slug) => {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    try {
      await api.delete(`/banner/delete-banner/${slug}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      fetchBanners();
    } catch (err) {
      console.error("Delete banner error:", err);
    }
  };

  return (
    <div className="p-6 space-y-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 border p-4 rounded-lg"
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
                  <Input placeholder="home / slider / offer" {...field} />
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
                    className="w-32 h-24 object-cover rounded mt-2"
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {editslug ? "Update Banner" : "Create Banner"}
          </Button>
        </form>
      </Form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {banners.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <img
                  src={item?.image?.[0]?.secure_url}
                  className="w-20 h-14 object-cover rounded"
                />
              </TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.link}</TableCell>
              <TableCell>{item.position}</TableCell>
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

export default CreateBanner;
