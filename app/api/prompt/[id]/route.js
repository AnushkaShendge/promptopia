import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import mongoose from "mongoose";

export const GET = async (req, { params }) => {
    try {
        await connectToDB();
        const prompt = await Prompt.findById(params.id).populate("creator");
        if (!prompt) return new Response(JSON.stringify({ error: "Prompt not found" }), { status: 404 });
        return new Response(JSON.stringify(prompt), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Error fetching prompt" }), { status: 500 });
    }
};

export const PATCH = async (req, { params }) => {
    const { prompt, tag } = await req.json();

    try {
        await connectToDB();
        const existingPrompt = await Prompt.findById(params.id).populate("creator");
        if (!existingPrompt) return new Response(JSON.stringify({ error: "Prompt not found" }), { status: 404 });

        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;
        await existingPrompt.save();

        return new Response(JSON.stringify(existingPrompt), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Error updating prompt" }), { status: 500 });
    }
};

export const DELETE = async (req, { params }) => {
    try {
        await connectToDB();

        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return new Response(JSON.stringify({ error: "Invalid prompt ID format" }), { status: 400 });
        }

        const prompt = await Prompt.findByIdAndDelete(params.id);
        if (!prompt) return new Response(JSON.stringify({ error: "Prompt not found" }), { status: 404 });

        return new Response(JSON.stringify({ message: "Prompt deleted successfully" }), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Error deleting prompt" }), { status: 500 });
    }
};
