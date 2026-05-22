import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

// Console karke dekho asliyat mein kya aa raha hai
console.log("Decoded Token:", token_decode);
        
        // Sabse pehle req.userId set karein (Ye hamesha safe hai)
        req.userId = token_decode.id;
        req.userRole = token_decode.role;

        // Agar req.body undefined hai (jaise GET requests mein), toh direct set na karein
        if (req.body) {
            req.body.userId = token_decode.id;
        } else {
            // Agar body nahi hai, toh usey empty object bana kar set kar sakte hain
            req.body = { userId: token_decode.id };
        }

        next();
    } catch (error) {
        console.log("Auth Error:", error.message);
        res.json({ success: false, message: "Invalid Token" });
    }
}

export default authMiddleware;
