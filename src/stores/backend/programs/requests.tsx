export const getPrograms = () => '/programs';
export const getArticles = () => '/articles';
export const getProgramById = (id: string) => `/programs/${id}`;
export const submitProgramForm = (id: string) => `/programs/${id}/info-request`;
export const getArticleById = (id: string) => `/articles/${id}`;
export const submitSupplementRequestForm = () => '/articles/supplement-request';
