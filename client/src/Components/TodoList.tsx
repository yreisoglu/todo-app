import React, { ChangeEvent, useEffect, useState } from "react";
import { ITodo } from "../Interfaces/todo.interface";
import { BsCheck, BsDownload, BsImage, BsPaperclip, BsPlus, BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { deleteTodo, getFilteredTodos, getTags, getTodos, postTodo, searchTodos } from "../Requests/todo";

export const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<ITodo[] | null>(null);
    const [tags, setTags] = useState<string[]>(["All"]);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [selectedTodo, setSelectedTodo] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [attachment, setAttachment] = useState<File | null>(null);
    const [content, setContent] = useState<string | null>(null);
    const [tag, setTag] = useState<string | null>(null);

    const formData = new FormData();

    const resourceURL = "http://localhost:5000/uploads/";

    useEffect(() => {
        async function fetchData() {
            await updatePage();
        }
        fetchData();
    }, []);

    const updateTodos = async () => {
        const todosData = await getTodos();
        setTodos(todosData);
    };

    const updateTags = async () => {
        const tagsData = await getTags();
        const newTags = new Set(tags.concat(tagsData));
        setTags(Array.from(newTags));
    };

    const updatePage = async () => {
        await updateTodos();
        await updateTags();
    };

    const handleTagFilterChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === "All") {
            updateTodos();
        } else {
            const todos = await getFilteredTodos(value);
            setTodos(todos);
        }
    };

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const searchResult = await searchTodos(value);
        setTodos(searchResult);
    };

    const logout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const handleOptionsClick = (todoId: string) => {
        setShowOptions(!showOptions);
        setSelectedTodo(todoId);
    };

    const handleDelete = async (id: string) => {
        const result = await deleteTodo(id);
        if (result) {
            setShowOptions(!showOptions);
            updatePage();
        }
    };

    const downloadFile = async (todo: ITodo) => {
        const response = await fetch(`${resourceURL + todo.attachment}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = todo.attachment || "file";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleTodoSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        image && formData.append("image", image);
        attachment && formData.append("attachment", attachment);

        formData.append("content", content as string);
        formData.append("tag", tag as string);
        const result = await postTodo(formData);
        if (result) {
            updatePage();
        }
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            setImage(event.target.files[0]);
        }
    };
    const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            setAttachment(event.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex justify-between items-center">
                <div className="flex-grow"></div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-3"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
            <div className="container mx-auto py-8">
                <div className="w-2/4 mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full border border-gray-300 rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="relative">
                            <select
                                className="block appearance-none w-full bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-blue-500"
                                defaultValue={tags[0]}
                                onChange={handleTagFilterChange}
                            >
                                {tags.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <BsThreeDots></BsThreeDots>
                            </div>
                        </div>
                    </div>
                    <form
                        className="bg-white shadow-md rounded-md p-4 mb-4 flex justify-between items-center"
                        onSubmit={handleTodoSubmit}
                    >
                        <div className="flex">
                            <div className="flex">
                                <input
                                    type="file"
                                    className="hidden"
                                    id="image-upload"
                                    name="image"
                                    onChange={handleImageChange}
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded cursor-pointer mx-1"
                                >
                                    <span className="flex items-center text-sm">
                                        <BsImage />
                                    </span>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>
                            <div className="flex">
                                <input
                                    type="file"
                                    className="hidden"
                                    id="file-upload"
                                    name="attachment"
                                    onChange={handleAttachmentChange}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded cursor-pointer"
                                >
                                    <span className="flex items-center text-sm">
                                        <BsPaperclip />
                                    </span>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>
                        </div>
                        <input
                            type="text"
                            id="content"
                            className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mx-3"
                            placeholder="Todo Content"
                            required
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <input
                            type="text"
                            id="tag"
                            className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mx-3"
                            placeholder="Todo tag"
                            onChange={(e) => setTag(e.target.value)}
                        />
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                            type="submit"
                        >
                            <span className="flex items-center">
                                <BsCheck />
                            </span>
                        </button>
                    </form>
                    {todos?.map((todo, index) => (
                        <div
                            className="bg-white shadow-md rounded-md p-4 mb-4 flex justify-between items-center"
                            key={index}
                        >
                            {todo.image && <img className="w-1/6" src={`${resourceURL + todo.image}`} alt="todo" />}
                            <div className="text-lg font-medium text-gray-800">{todo.content}</div>

                            <div className="relative flex items-center">
                                <div className="mr-2 text-right">
                                    <div className="text-sm font-medium text-gray-500">{todo.tag}</div>
                                    {showOptions && selectedTodo === todo._id && (
                                        <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded-md py-2 w-36 z-20">
                                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Update
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleDelete(todo._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <button
                                        className="p-1 focus:outline-none"
                                        onClick={() => handleOptionsClick(todo._id)}
                                    >
                                        <BsThreeDotsVertical></BsThreeDotsVertical>
                                    </button>
                                    {todo.attachment && (
                                        <button className="p-1 focus:outline-none" onClick={() => downloadFile(todo)}>
                                            <BsDownload></BsDownload>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
