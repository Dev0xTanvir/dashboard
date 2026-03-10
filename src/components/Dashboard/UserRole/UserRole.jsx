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
const UserSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password required"),
  role: z.string().min(1, "Role required"),
});

export default function CreateUserRole() {
  const [users, setUsers] = useState([]);

  const form = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  // ---------------- GET ALL ----------------
  const getUsers = async () => {
    const res = await api.get("/user/getalluserrole");
    setUsers(res.data.data || []);
  };
  useEffect(() => {
    getUsers();
  }, []);

  // ---------------- CREATE ----------------
  const onSubmit = async (values) => {
    const token = localStorage.getItem("accessToken");

    try {
      await api.post("/user/adduserrole", values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      form.reset();
      getUsers();
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
          <Input {...form.register("name")} placeholder="User Name" />

          <Input {...form.register("email")} placeholder="User Email" />

          <Input
            type="password"
            {...form.register("password")}
            placeholder="User Password"
          />

          <Input {...form.register("role")} placeholder="Role ID" />

          <Button type="submit">Create User</Button>
        </form>
      </Form>

      {/* -------- TABLE -------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.role.map((r) => r.name).join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
