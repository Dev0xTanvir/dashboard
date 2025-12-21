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
    queryKey: ["getallbanner"],
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
    queryKey: ["getallbanner"],
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
    queryKey: ["getallbanner"],
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
    queryKey: ["getallbanner"],
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


