import { Subscriber } from "../models/subscriber.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const handleSubscription = asyncHandler(async(req, res) => {
    const { email } = req.body; 

    if(!email){
        throw new ApiError(400, "Email is Required"); 
    }

    let subscriber = await Subscriber.findOne({ email }); 

    if(subscriber){ 
        throw new ApiError(400, "Email is already subscribed"); 
    }

    // create a new subscriber
    const newSub = await Subscriber.create({ email }); 
    if(!newSub) {
        throw new ApiError(500, "failed to subscribe"); 
    }

    return res.status(200).json(new ApiResponse(200, newSub, "Successfully subscribed to the newsletter!"))
})

export { handleSubscription }