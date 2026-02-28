import { useQuery } from "@tanstack/react-query";
import { api } from "../../Utils/axios";

// GetAllBanner

export const useGetAllBanner = () => {
  return useQuery({
    queryKey: ["getallbanner"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/banner/getall-banner", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetallCategory

export const useGetAllCategory = () => {
  return useQuery({
    queryKey: ["getallcategory"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/category/getall-category", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetallSubCategory

export const useGetAllSubCategory = () => {
  return useQuery({
    queryKey: ["getallsubcategory"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/subcategory/getall-subcategory", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllBrand

export const useGetAllBrand = () => {
  return useQuery({
    queryKey: ["getallbrand"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/brand/getall-brand", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllDiscount

export const useGetAllDiscount = () => {
  return useQuery({
    queryKey: ["getalldiscount"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/discount/getalldiscount-create", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllProduct

export const useGetAllProduct = () => {
  return useQuery({
    queryKey: ["getallproduct"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/product/getall-product", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllVarient

export const useGetAllVarient = () => {
  return useQuery({
    queryKey: ["getallvarient"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/variant/getall-variant", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllCoupon

export const useGetAllCoupon = () => {
  return useQuery({
    queryKey: ["getallcoupon"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/copun/getall-copun", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllWarrenty

export const useGetAllWarrenty = () => {
  return useQuery({
    queryKey: ["getallWarrenty"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/warrenty/getall-warrenty", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};
