import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
const PermissionSchema = z.object({
  user: z.string().min(1, "User required"),
  permesion: z.array(
    z.object({
      permesionId: z.string().min(1, "Permission required"),
      action: z.array(z.string()).min(1),
    }),
  ),
});

export default function CreateUserPermision() {
  const [permissions, setPermissions] = useState([]);

  const form = useForm({
    resolver: zodResolver(PermissionSchema),
    defaultValues: {
      user: "",
      permesion: [
        {
          permesionId: "",
          action: ["create"],
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "permesion",
  });

  // ---------------- GET ALL ----------------
  const getPermissions = async () => {
    const res = await api.get("/permision/getalluserpermision");
    setPermissions(res.data.data || []);
  };

  useEffect(() => {
    getPermissions();
  }, []);

  // ---------------- CREATE ----------------
  const onSubmit = async (values) => {
    const token = localStorage.getItem("accessToken");

    try {
      await api.post("/permision/adduserpermision", values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      form.reset();
      getPermissions();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 space-y-10">
      {/* -------- FORM -------- */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 border p-4 rounded-lg"
        >
          <Input {...form.register("user")} placeholder="User ID" />

          {fields.map((item, index) => (
            <div key={item.id} className="flex gap-3">
              <Input
                {...form.register(`permesion.${index}.permesionId`)}
                placeholder="Permission ID"
              />

              <Input value="create" readOnly className="w-24" />

              <Input value="read" readOnly className="w-24" />
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              append({
                permesionId: "",
                action: ["create", "read"],
              })
            }
          >
            Add Permission
          </Button>

          <Button type="submit">Create Permission</Button>
        </form>
      </Form>

      {/* -------- TABLE -------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Permission</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {permissions.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                {item.permesion.map((r) => r.permesionId?.name).join(", ")}
              </TableCell>

              <TableCell>{item.role?.map((p) => p.name).join(", ")}</TableCell>

              <TableCell>
                {item.permesion.map((p) => p.action.join(", ")).join(" | ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
