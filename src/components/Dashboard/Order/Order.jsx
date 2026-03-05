import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { api } from "../../../Utils/axios";

export default function CreateOrder() {
  const [orders, setOrders] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [courierNote, setCourierNote] = useState("");

  const { register, handleSubmit, reset, setValue } = useForm();

  // ---------------- GET ORDER ----------------

  const getOrders = async () => {
    const res = await api.get("/order/allorder");
    setOrders(res.data.data || []);
  };

  useEffect(() => {
    getOrders();
  }, []);

  // ---------------- CREATE / UPDATE ----------------

  const onSubmit = async (data) => {
    const token = localStorage.getItem("accessToken");

    const payload = {
      guestId: data.guestId,

      items: [],

      shippingInfo: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
      },

      deliveryCharge: data.deliveryCharge,
      paymentMethod: data.paymentMethod,
    };

    if (!editId) {
      await api.post("/order/order-create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await api.put(`/order/update-order/${editId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditId(null);
    }

    reset();
    getOrders();
  };

  // ---------------- EDIT ----------------

  const handleEdit = (item) => {
    setEditId(item._id);

    setValue("guestId", item.guestId);
    setValue("fullName", item.shippingInfo?.fullName);
    setValue("phone", item.shippingInfo?.phone);
    setValue("email", item.shippingInfo?.email);
    setValue("address", item.shippingInfo?.address);
    setValue("deliveryCharge", item.deliveryCharge);
    setValue("paymentMethod", item.paymentMethod);
  };

  // ---------------- DELETE ----------------

  const deleteOrder = async (id) => {
    const token = localStorage.getItem("accessToken");

    await api.delete(`/order/delete-order/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    getOrders();
  };

  // ---------------- CANCEL ----------------

  const cancelOrder = async (id) => {
    await api.put(`/order/cancel-order/${id}`);

    getOrders();
  };

  // ------------------------------------

  const getCouriers = async () => {
  try {
    const res = await api.get("/order/getallsingleReturnRequest");
    setCouriers(res.data?.data || []);
  } catch (error) {
    console.error("Courier fetch error:", error);
  }
};

useEffect(() => {
  getOrders();
  getCouriers();
}, []);

  // ---------------- CREATE COURIER ----------------

  const createCourier = async (id) => {
    await api.post("/order/createcourier", { orderId: id });

    alert("Courier Created");
    getCouriers();
  };

  // ---------------- MULTIPLE COURIER ----------------

  const createMultipleCourier = async () => {
    await api.post("/order/createMultipleCourier", {
      orderIds: selectedOrders,
    });

    alert("Multiple Courier Created");
  };

  // ---------------- RETURN REQUEST ----------------

  const createReturn = async (id) => {
    await api.post("/order/createReturnRequest", {
      orderId: id,
      reason: "Customer Request",
    });

    alert("Return Request Created");
  };

  // ---------------- SELECT ORDER ----------------

  const toggleSelect = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((i) => i !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  return (
    <div className="p-6 space-y-10">
      {/* ================= ORDER FORM ================= */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border p-4 rounded-lg"
      >
        <Input {...register("guestId")} placeholder="Guest ID" />

        <Input {...register("fullName")} placeholder="Full Name" />

        <Input {...register("phone")} placeholder="Phone" />

        <Input {...register("email")} placeholder="Email" />

        <Input {...register("address")} placeholder="Address" />

        <Input
          {...register("deliveryCharge")}
          placeholder="Delivery Charge ID"
        />

        <Input {...register("paymentMethod")} placeholder="Payment Method" />

        <Button type="submit">
          {editId ? "Update Order" : "Create Order"}
        </Button>
      </form>

      {/* ================= BULK COURIER ================= */}

      <Button className="bg-green-600" onClick={createMultipleCourier}>
        Create Courier For Selected
      </Button>

      {/* ================= ORDER TABLE ================= */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>TransactionId</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <input
                  type="checkbox"
                  onChange={() => toggleSelect(item._id)}
                />
              </TableCell>

              <TableCell>{item.shippingInfo?.fullName}</TableCell>

              <TableCell>{item.shippingInfo?.phone}</TableCell>

              <TableCell>{item.shippingInfo?.email}</TableCell>

              <TableCell>{item.paymentMethod}</TableCell>

              <TableCell>{item.orderStatus}</TableCell>
              <TableCell>{item.transactionId}</TableCell>

              <TableCell className="flex gap-2">
                <Button
                  className="bg-yellow-500"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </Button>

                <Button
                  className="bg-red-600"
                  onClick={() => deleteOrder(item._id)}
                >
                  Delete
                </Button>

                <Button
                  className="bg-gray-600"
                  onClick={() => cancelOrder(item._id)}
                >
                  Cancel
                </Button>

                <Button
                  className="bg-green-600"
                  onClick={() => createCourier(item._id)}
                >
                  Courier
                </Button>

                <Button
                  className="bg-purple-600"
                  onClick={() => createReturn(item._id)}
                >
                  Return
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ================= COURIER FORM ================= */}
      <div className="space-y-2 border p-4 rounded-lg">
        <h2 className="text-lg font-bold">Create Courier</h2>
        <Input
          placeholder="Order ID"
          value={selectedOrderId || ""}
          onChange={(e) => setSelectedOrderId(e.target.value)}
        />
        <Input
          placeholder="Note"
          value={courierNote || ""}
          onChange={(e) => setCourierNote(e.target.value)}
        />
        <Button
          className="bg-green-600"
          onClick={async () => {
            if (!selectedOrderId) return alert("Order ID required");
            try {
              await api.post("/order/createcourier", {
                id: selectedOrderId,
                note: courierNote,
              });
              alert("Courier Created");
              setCourierNote("");
              setSelectedOrderId("");
              getCouriers();
            } catch (err) {
              alert(err.response?.data?.message || err.message);
            }
          }}
        >
          Create Courier
        </Button>
      </div>

      {/* ================= COURIER TABLE ================= */}
      <h2 className="text-xl font-bold mt-10">Courier List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Courier ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {couriers.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.courier?.name || "-"}</TableCell>
              <TableCell>{item.courier?.trackingId || "-"}</TableCell>
              <TableCell>{item.courier?.status || "-"}</TableCell>
              <TableCell>{item.status || "-"}</TableCell>
              <TableCell>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
