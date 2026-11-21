export async function searchTracks(query) {
    if (!query.trim()) return [];

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=12`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Ошибка при запросе к api');
    }

    const data = await response.json();

    return data.results
        .filter((item) => Boolean(item.previewUrl))
        .map((item) => ({
            id: item.trackId,
            title: item.trackName,
            artist: item.artistName,
            artwork: item.artworkUrl100.replace('100x100bb', '300x300bb'),
            previewUrl: item.previewUrl,
        }));
}