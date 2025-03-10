import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt"
export const GET = async(req , {params}) => {
    try {
        await connectToDB()
        const prompts = await Prompt.find({
            creator: params.id
        }).populate('creator')
        return new Response(JSON.stringify(prompts) , { status: 200})
    }catch(err){
        console.error(err)
        res.json({error: 'Error fetching prompts'})
        return new Response(JSON.stringify({error: 'Error fetching prompts'}) , { status: 500})
    }
} 