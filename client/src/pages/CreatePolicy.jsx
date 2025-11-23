import { useState } from "react";
import API from "../api/axios";


export default function CreatePolicy() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        await API.post("/policies", { title, content });
        alert("Policy Created");
    };


    return (
        <div className="p-10 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Create Policy</h2>


            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input className="border p-2" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
                <textarea className="border p-2" placeholder="Content" onChange={(e) => setContent(e.target.value)} />
                <button className="bg-green-600 text-white p-2">Upload</button>
            </form>
        </div>
    );
}