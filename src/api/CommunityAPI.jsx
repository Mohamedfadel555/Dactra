import { useAxios } from "../hooks/useAxios";

export const useCommunityAPI = () => {
  const axiosInstance = useAxios();

  const getPosts = async () => {
    const res = await axiosInstance.get("Posts");
    return res.data;
  };

  const likePost = (id) => {
    const res = axiosInstance.post(`Posts/${id}/like`);
    return res;
  };

  const savePost = (id) => {
    const res = axiosInstance.post(`Posts/${id}/save`);
    return res;
  };

  const postArtical = async (Data) => {
    const res = await axiosInstance.post("Posts", Data);
    return res;
  };

  const filterPosts = async (id) => {
    console.log(id);
    const res = await axiosInstance.get("Posts/filterOn", {
      params: { filter: id },
    });
    return res.data;
  };

  return { getPosts, likePost, savePost, postArtical, filterPosts };
};
