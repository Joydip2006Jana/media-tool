const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function getYouTubeVideoId(url) {
    try {
        if (url.includes("youtu.be")) {
            return url.split("youtu.be/")[1].split("?")[0];
        }
        if (url.includes("youtube.com")) {
            const u = new URL(url);
            return u.searchParams.get("v");
        }
        return null;
    } catch {
        return null;
    }
}

app.post("/submit", async (req, res) => {
    const url = req.body.videoUrl;

    if (!url || !url.startsWith("http")) {
        return res.json({ message: "Invalid URL ❌" });
    }

    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
        return res.json({ message: "Normal URL detected 🌐" });
    }

    try {
        // oEmbed (no API key)
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const response = await fetch(oembedUrl);
        const data = await response.json();

        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        return res.json({
            message: "YouTube video detected 🎬",
            videoId,
            title: data.title,
            channel: data.author_name,
            thumbnail
        });
    } catch (err) {
        return res.json({ message: "Info fetch failed ❌" });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log("Server running on http://localhost:3000");
});
