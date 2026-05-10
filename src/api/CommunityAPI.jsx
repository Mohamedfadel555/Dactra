import { useAxios } from "../hooks/useAxios";

export const useCommunityAPI = () => {
  const axiosInstance = useAxios();

  const getPosts = async (params) => {
    const res = await axiosInstance.get("Posts", { params });
    return res.data;
  };

  const likePost = (Id) => {
    const res = axiosInstance.post(`Posts/${Id}/like`);
    return res;
  };

  const savePost = (Id) => {
    const res = axiosInstance.post(`Posts/${Id}/save`);
    return res;
  };

  const filterPosts = async (params) => {
    console.log(params);
    const res = await axiosInstance.get("Posts/filterOn", { params });
    return res.data;
  };

  const getQuestions = async (params) => {
    const res = await axiosInstance.get("Questions", { params });
    return res.data;
  };

  const interestPost = (Id) => {
    const res = axiosInstance.post(`Questions/${Id}/interest`);
    return res;
  };

  const filterQuestion = async (params) => {
    const res = await axiosInstance.get("Questions/filterOn", {
      params,
    });
    return res.data;
  };

  const saveQuestion = (Id) => {
    const res = axiosInstance.post(`Questions/${Id}/save`);
    return res;
  };
  const postArtical = async (Data) => {
    const formData = new FormData();
    formData.append("content", Data.content);
    if (Data.image) formData.append("image", Data.image);

    const res = await axiosInstance.post("Posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  };

  const PostQuestion = async (Data) => {
    const formData = new FormData();
    formData.append("content", Data.content);
    if (Data.image) formData.append("image", Data.image);

    const res = await axiosInstance.post("Questions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  };
  const myPosts = async (params) => {
    const res = await axiosInstance.get("Posts/my-posts", { params });
    return res.data;
  };

  const myQuestions = async (params) => {
    const res = await axiosInstance.get("Questions/my-questions", { params });
    return res.data;
  };

  const getQuestionsAnswers = async (Id, params) => {
    console.log(Id);
    const res = await axiosInstance.get(`Questions/${Id}/comments`, { params });
    return res.data;
  };

  const postAnswer = async (Id, Data) => {
    const res = await axiosInstance.post(`Questions/${Id}/comments`, Data);
    return res;
  };

  const getCommentReplies = async (Id, params) => {
    const res = await axiosInstance.get(`Questions/comments/${Id}/replies`, {
      params,
    });
    return res.data;
  };

  const likeComment = (Id) => {
    const res = axiosInstance.post(`Questions/comments/${Id}/like`);
    return res;
  };

  const getQuestionById = async (id) => {
    const res = await axiosInstance.get(`Questions/${id}`);
    return res.data;
  };

  const getQuestionsByTag = async (id, params) => {
    const res = await axiosInstance.get(`Questions/tag/${id}`, { params });
    return res.data;
  };
  const getPostsByTag = async (id, params) => {
    const res = await axiosInstance.get(`Posts/tag/${id}`, { params });
    return res.data;
  };

  const getQuestionsTrendingTags = async () => {
    const res = await axiosInstance.get("Questions/top-tags", { top: 4 });
    return res.data;
  };
  const getPostsTrendingTags = async () => {
    const res = await axiosInstance.get("Posts/top-tags", { top: 4 });
    return res.data;
  };

  const deletePost = (id) => {
    const res = axiosInstance.delete(`Posts/${id}`);
    return res;
  };

  const deleteQuestion = (id) => {
    const res = axiosInstance.delete(`Questions/${id}`);
    return res;
  };

  const deletePostComment = (id) => {
    const res = axiosInstance.delete(`Posts/comments/${id}`);
    return res;
  };
  const deleteQuestionComment = (id) => {
    const res = axiosInstance.delete(`Questions/comments/${id}`);
    return res;
  };

  const editPost = (id, Data) => {
    const res = axiosInstance.put(`Posts/${id}`, Data);
    return res;
  };
  const editQuestion = (id, Data) => {
    const res = axiosInstance.put(`Questions/${id}`, Data);
    return res;
  };
  const editComment = (id, Data) => {
    console.log(Data);
    const res = axiosInstance.put(`Questions/comments/${id}`, Data);
    return res;
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
    getQuestionsAnswers,
    postAnswer,
    getCommentReplies,
    likeComment,
    getQuestionById,
    getQuestionsByTag,
    getPostsByTag,
    getQuestionsTrendingTags,
    getPostsTrendingTags,
    deletePost,
    deletePostComment,
    deleteQuestion,
    deleteQuestionComment,
    editComment,
    editPost,
    editQuestion,
  };
};
