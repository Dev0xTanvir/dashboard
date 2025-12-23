import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "../../../Utils/axios";

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
import { Textarea } from "@/components/ui/textarea";

/* ------------------ ZOD SCHEMA ------------------ */
const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  subCategory: z.string().min(1),
  brand: z.string().min(1),
  sku: z.string().min(1),
  barCode: z.string().optional(),
  qrCode: z.string().optional(),
  unit: z.string(),
  groupUnit: z.string().optional(),
  groupUnitQuantity: z.coerce.number(),
  manufactureCountry: z.string(),
  rating: z.coerce.number(),
  variantType: z.enum(["single", "multiple"]),
  variant: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
  tag: z.array(z.string()).optional(),
  totalStock: z.coerce.number(),
  purchasePrice: z.coerce.number(),
  retailPrice: z.coerce.number(),
  wholeSalePrice: z.coerce.number(),
  minimunWholeSaleOrderQuantity: z.coerce.number(),
  minimumOrder: z.coerce.number(),
  availabilityStatus: z.boolean(),
  instock: z.boolean(),
  isActive: z.boolean(),
  totalSell: z.coerce.number().optional(),
  image: z.any().optional(),
});

/* ---------------- REUSABLE ARRAY FIELD ---------------- */

const ArrayInputField = ({ form, name, label }) => {
  const values = form.watch(name) || [];

  const addItem = () => form.setValue(name, [...values, ""]);
  const removeItem = (index) =>
    form.setValue(
      name,
      values.filter((_, i) => i !== index)
    );
  const updateItem = (index, val) => {
    const newArr = [...values];
    newArr[index] = val;
    form.setValue(name, newArr);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex flex-col gap-2">
            {values.map((val, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={val}
                  onChange={(e) => updateItem(idx, e.target.value)}
                />
                <Button type="button" onClick={() => removeItem(idx)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addItem}>
              Add {label}
            </Button>
          </div>
        </FormItem>
      )}
    />
  );
};

/* ------------------ MAIN COMPONENT ------------------ */
export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editslug, setEditslug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState([]);

  /* ------------------ FETCH ALL DATA ------------------ */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));

        const [prodRes, catRes, subRes, brandRes] = await Promise.all([
          api.get("/product/getall-product", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/category/getall-category", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/subcategory/getall-subcategory", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/brand/getall-brand", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProducts(prodRes.data.data || []);
        setCategories(catRes.data.data || []);
        setSubCategories(subRes.data.data || []);
        setBrands(brandRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const form = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      subCategory: "",
      brand: "",
      sku: "",
      barCode: "",
      qrCode: "",
      unit: "Piece",
      groupUnit: "",
      groupUnitQuantity: 1,
      manufactureCountry: "",
      rating: 0,
      variantType: "single",
      variant: [] || "",
      size: [],
      color: [],
      tag: [],
      totalStock: 0,
      purchasePrice: 0,
      retailPrice: 0,
      wholeSalePrice: 0,
      minimunWholeSaleOrderQuantity: 1,
      minimumOrder: 1,
      availabilityStatus: true,
      instock: true,
      isActive: true,
      totalSell: 0,
      image: [],
    },
  });

  const watchCategory = form.watch("category");
  const watchVariantType = form.watch("variantType");

  const filteredSub = subCategories.filter(
    (s) => s.category?._id === watchCategory
  );

  /* ------------------ SUBMIT / CREATE / UPDATE ------------------ */
  const onSubmit = async (values) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      const value = values[key];

      if (value === undefined || value === null) return;

      // 🔥 IMAGE
      if (key === "image") {
        if (value && value.length > 0) {
          Array.from(value).forEach((file) => {
            formData.append("image", file);
          });
        }
        return;
      }

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    try {
      if (!editslug) {
        await api.post("/product/create-product", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const updated = await api.put(
          `/product/update-product/${editslug}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // ---------------- FIX 3: optimistic UI update ----------------
        setProducts((prev) =>
          prev.map((p) => (p.slug === editslug ? updated.data.data : p))
        );
        setEditslug(null);
      }

      form.reset();
      setPreview([]);
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------ EDIT ------------------ */
  const handleEdit = (product) => {
    setEditslug(product.slug);
    form.reset({
      name: product.name,
      description: product.description,
      category: product.category?._id,
      subCategory: product.subCategory?._id,
      brand: product.brand?._id,
      sku: product.sku,
      barCode: product.barCode,
      qrCode: product.qrCode,
      unit: product.unit,
      groupUnit: product.groupUnit,
      groupUnitQuantity: product.groupUnitQuantity,
      manufactureCountry: product.manufactureCountry,
      rating: product.rating,
      variantType: product.variantType,
      variant: product.variant || [],
      size: product.size || [],
      color: product.color || [],
      tag: product.tag || [],
      totalStock: product.totalStock,
      purchasePrice: product.purchasePrice,
      retailPrice: product.retailPrice,
      wholeSalePrice: product.wholeSalePrice,
      minimunWholeSaleOrderQuantity: product.minimunWholeSaleOrderQuantity,
      minimumOrder: product.minimumOrder,
      availabilityStatus: product.availabilityStatus,
      instock: product.instock,
      isActive: product.isActive,
      totalSell: product.totalSell || 0,
      image: [],
    });
    setPreview(product.image?.map((img) => img.secure_url) || []);
  };

  /* ------------------ DELETE ------------------ */
  const handleDelete = async (slug) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    try {
      await api.delete(`/product/delete-product/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-6xl">
      {/* ------------- FORM ------------- */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 border p-5 rounded-lg"
        >
          {/* BASIC FIELDS */}
          <InputField form={form} name="name" label="Product Name" />
          <TextareaField form={form} name="description" label="Description" />
          <SelectField
            form={form}
            name="category"
            label="Category"
            options={categories}
          />
          <SelectField
            form={form}
            name="subCategory"
            label="Sub Category"
            options={filteredSub}
          />
          <SelectField
            form={form}
            name="brand"
            label="Brand"
            options={brands}
          />
          <InputField form={form} name="sku" label="SKU" />
          <InputField form={form} name="barCode" label="BarCode" />
          <InputField form={form} name="qrCode" label="QR Code URL" />
          <InputField form={form} name="unit" label="Unit" />
          <InputField form={form} name="groupUnit" label="Group Unit" />
          <InputField
            form={form}
            name="groupUnitQuantity"
            label="Group Unit Qty"
            type="number"
          />
          <InputField
            form={form}
            name="manufactureCountry"
            label="Manufacture Country"
          />
          <InputField form={form} name="rating" label="Rating" type="number" />
          <InputField
            form={form}
            name="totalStock"
            label="Total Stock"
            type="number"
          />
          <InputField
            form={form}
            name="retailPrice"
            label="Retail Price"
            type="number"
          />
          <InputField
            form={form}
            name="purchasePrice"
            label="Purchase Price"
            type="number"
            min={100}
          />
          <InputField
            form={form}
            name="wholeSalePrice"
            label="Wholesale Price"
            type="number"
          />
          <InputField
            form={form}
            name="minimunWholeSaleOrderQuantity"
            label="Minimum Wholesale Qty"
            type="number"
          />
          <InputField
            form={form}
            name="minimumOrder"
            label="Minimum Order Qty"
            type="number"
          />
          <InputField
            form={form}
            name="totalSell"
            label="Total Sell"
            type="number"
          />

          {/* VARIANT TYPE */}
          <FormField
            control={form.control}
            name="variantType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variant Type</FormLabel>
                <FormControl>
                  <select {...field} className="w-full border p-2 rounded">
                    <option value="single">Single</option>
                    <option value="multiple">Multiple</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* DYNAMIC ARRAY FIELDS */}
          {watchVariantType === "multiple" && (
            <>
              <ArrayInputField form={form} name="variant" label="Variant" />
              <ArrayInputField form={form} name="size" label="Size" />
              <ArrayInputField form={form} name="color" label="Color" />
              <ArrayInputField form={form} name="tag" label="Tag" />
            </>
          )}

          {/* IMAGE UPLOAD */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      field.onChange(files);
                      setPreview(Array.from(files));
                    }}
                  />
                </FormControl>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {preview &&
                    Array.from(preview).map((file, idx) => (
                      <img
                        key={idx}
                        src={
                          typeof file === "string"
                            ? file
                            : URL.createObjectURL(file)
                        }
                        alt="preview"
                        className="h-16 w-16 object-cover rounded"
                      />
                    ))}
                </div>
              </FormItem>
            )}
          />

          <Button type="submit">
            {editslug ? "Update Product" : "Create Product"}
          </Button>
        </form>
      </Form>

      {/* ------------- TABLE ------------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>SubCategory</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Variant Type</TableHead>
            <TableHead>Variant / Size / Color / Tag</TableHead>
            <TableHead>Total Stock</TableHead>
            <TableHead>Prices</TableHead>
            <TableHead>Total Sell</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.category?.name}</TableCell>
              <TableCell>{p.subCategory?.name}</TableCell>
              <TableCell>{p.brand?.name}</TableCell>
              <TableCell>{p.sku}</TableCell>
              <TableCell>{p.variantType}</TableCell>
              <TableCell>
                {p.variant?.join(", ")} / {p.size?.join(", ")} /{" "}
                {p.color?.join(", ")} / {p.tag?.join(", ")}
              </TableCell>
              <TableCell>{p.totalStock}</TableCell>
              <TableCell>
                Retail: {p.retailPrice} / Wholesale: {p.wholeSalePrice}
              </TableCell>
              <TableCell>
                {p.shippingInformation} / {p.warehouseLocation} /{" "}
                {p.warrantyInformation}
              </TableCell>
              <TableCell>{p.totalSell}</TableCell>
              <TableCell className="flex gap-2">
                {p.image?.map((img, i) => (
                  <img
                    key={i}
                    src={img.secure_url}
                    className="h-12 w-12 object-cover rounded"
                  />
                ))}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button className="bg-yellow-500" onClick={() => handleEdit(p)}>
                  Edit
                </Button>
                <Button
                  className="bg-red-600"
                  onClick={() => handleDelete(p.slug)}
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

/* ---------------- REUSABLE FIELDS ---------------- */
const InputField = ({ form, name, label, type = "text" }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input type={type} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const TextareaField = ({ form, name, label }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea {...field} />
        </FormControl>
      </FormItem>
    )}
  />
);

const SelectField = ({ form, name, label, options }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <select {...field} className="w-full border p-2 rounded">
            <option value="">Select</option>
            {options.map((o) => (
              <option key={o._id} value={o._id}>
                {o.name}
              </option>
            ))}
          </select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
