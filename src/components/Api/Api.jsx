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
