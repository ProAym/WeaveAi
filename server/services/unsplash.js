const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function searchUnsplashImages(query, count = 15) {
    if (!UNSPLASH_ACCESS_KEY) {
        console.warn("[Unsplash] UNSPLASH_ACCESS_KEY not set — no images will be available");
        return [];
    }
    try {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
        const res = await fetch(url, {
            headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
        });
        if (!res.ok) {
            console.error(`[Unsplash] Search failed: ${res.status}`);
            return [];
        }
        const data = await res.json();
        return (data.results || []).map((photo) => ({
            url: `${photo.urls.raw}&auto=format&fit=crop&w=800&q=80`,
            description: photo.alt_description || photo.description || query,
        }));
    } catch (err) {
        console.error("[Unsplash] Search error:", err.message);
        return [];
    }
}