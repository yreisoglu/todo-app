import axios from "axios";
import { ITodo } from "../Interfaces/todo.interface";

export const getTodos = async () => {
    const result = await axios.get<ITodo[]>("/todo");
    return result.data;
};

export const deleteTodo = async (id: string) => {
    const result = await axios.delete<ITodo[]>("/todo", { params: { id } });
    return result.status === 200;
};

export const getTags = async () => {
    const result = await axios.get<string[]>("/todo/tags");
    return result.data;
};

export const getFilteredTodos = async (tag: string) => {
    const result = await axios.get<ITodo[]>("/todo/filter", { params: { tag } });
    return result.data;
};

export const searchTodos = async (search: string) => {
    const result = await axios.get<ITodo[]>("/todo/search", { params: { search } });
    return result.data;
};

export const postTodo = async (formData: FormData) => {
    const result = await axios.post<ITodo>("/todo", formData);
    return result.status === 200;
};
