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

  const postArtical = async (Data) => {
    const res = await axiosInstance.post("Posts", Data);
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

  const PostQuestion = async (Data) => {
    const res = await axiosInstance.post("Questions", Data);
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

  const getCommentReplies = async (Id) => {
    const res = await axiosInstance.get(`Questions/comments/${Id}/replies`);
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
  };
};
