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
const SalesmanSchema = z.object({
  name: z.string().min(2, "Name required"),
});

export default function CreateRole() {
  const [salesmans, setSalesmans] = useState([]);
  const [editSlug, setEditSlug] = useState(null);

  const form = useForm({
    resolver: zodResolver(SalesmanSchema),
    defaultValues: {
      name: "",
    },
  });

  // ---------------- GET ALL ----------------
  const getSalesman = async () => {
    const res = await api.get("/role/getall-role");
    setSalesmans(res.data.data || []);
  };

  useEffect(() => {
    getSalesman();
  }, []);

  // ---------------- SUBMIT ----------------
  const onSubmit = async (values) => {
    const token = localStorage.getItem("accessToken");

    try {
      if (!editSlug) {
        await api.post("/role/create-role", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/role/update-role/${editSlug}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditSlug(null);
      }

      form.reset();
      getSalesman();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item) => {
    setEditSlug(item.slug);
    form.reset({
      name: item.name,
    });
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (slug) => {
    const token = localStorage.getItem("accessToken");

    await api.delete(`/role/delete-role/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    getSalesman();
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
            {...form.register("name")}
            placeholder="Salesman Name"
          />

          <Button type="submit">
            {editSlug ? "Update Salesman" : "Create Salesman"}
          </Button>
        </form>
      </Form>

      {/* -------- TABLE -------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {salesmans.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>

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