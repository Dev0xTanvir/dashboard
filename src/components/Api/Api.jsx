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

// GetAllShipinginfo

export const useGetAllShipinginfo = () => {
  return useQuery({
    queryKey: ["getallShipinginfo"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/shipinginfo/getall-shiping", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllWearhouse

export const useGetAllWearhouse = () => {
  return useQuery({
    queryKey: ["getallWearhouse"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/wearhouse/getall-wearhouse", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllCart

export const useGetAllCart = () => {
  return useQuery({
    queryKey: ["getallCart"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/cart/getcart", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllDeliverycharge

export const useGetAllDeliverycharge = () => {
  return useQuery({
    queryKey: ["getallDeliverycharge"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/deliverycharge/getalldelivery-create", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllOrder

export const useGetAllOrder = () => {
  return useQuery({
    queryKey: ["getallOrder"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/order/allorder", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllCourier

export const useGetAllCourier = () => {
  return useQuery({
    queryKey: ["getallCourier"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/order/getallsingleReturnRequest", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllRole

export const useGetAllRole = () => {
  return useQuery({
    queryKey: ["getallRole"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/role/getall-role", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

// GetAllPermision

export const useGetAllPermision = () => {
  return useQuery({
    queryKey: ["getallPermision"],
    queryFn: async () => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      const response = await api.get("/permision/getall-permision", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};