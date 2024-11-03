import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const POST = async (req) => {
    try {
        // Parse the JSON body
        const { userId, prompt, tag } = await req.json();
        
        // Ensure all required fields are present
        if (!userId || !prompt || !tag) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // Connect to the database
        await connectToDB();

        // Create and save the new prompt
        const newPrompt = new Prompt({
            creator: userId,
            prompt,
            tag,
        });

        await newPrompt.save();

        return new Response(JSON.stringify(newPrompt), { status: 201 });
    } catch (error) {
        console.error("Error creating prompt:", error);
        return new Response(JSON.stringify({ error: "Error creating prompt" }), { status: 500 });
    }
};
