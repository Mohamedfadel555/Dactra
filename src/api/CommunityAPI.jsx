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
    const res = await axiosInstance.get("Posts/filterOn", {
      params: { filter: id },
    });
    return res.data;
  };

  const getQuestions = async () => {
    const res = await axiosInstance.get("Questions");
    return res.data;
  };

  const interestPost = (id) => {
    const res = axiosInstance.post(`Questions/${id}/interest`);
    return res;
  };

  const filterQuestion = async (id) => {
    const res = await axiosInstance.get("Questions/filterOn", {
      params: { filter: id },
    });
    return res.data;
  };

  const saveQuestion = (id) => {
    const res = axiosInstance.post(`Questions/${id}/save`);
    return res;
  };

  const PostQuestion = async (Data) => {
    const res = await axiosInstance.post("Questions", Data);
    return res;
  };

  const myPosts = async () => {
    const res = await axiosInstance.get("Posts/my-posts");
    return res.data;
  };

  const myQuestions = async () => {
    const res = await axiosInstance.get("Questions/my-questions");
    return res.data;
  };

  return {
    getPosts,
    likePost,
    savePost,
    postArtical,
    filterPosts,
    getQuestions,
    interestPost,
    filterQuestion,
    saveQuestion,
    PostQuestion,
    myPosts,
    myQuestions,
  };
};
