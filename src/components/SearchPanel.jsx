import {useState} from "react";
import {Search, Upload} from "lucide-react";
import {searchTracks} from "../api/itunes.js";

export function SearchPanel({onSelectTrack, currentTrackId}) {
    const [query, setQuery] = useState('');
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSearch(e) {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        try {
            const results = await searchTracks(query);
            setTracks(results);
            if (results.length === 0) setError('Ничего не найдено');
        } catch {
            setError('Не удалось загрузить треки из iTunes');
        } finally {
            setLoading(false);
        }
    }

    function handleLocalFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);
        onSelectTrack({
            id: Date.now(),
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Локальный файл',
            artwork: '',
            previewUrl: localUrl,
        });
    }

    return (
        <div className="panel">
            <form onSubmit={handleSearch} className="search-row">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Найти трек (например, Daft Punk)..."
                />
                <button type="submit" disabled={loading}>
                    <Search size={16}/>
                    {loading ? 'Поиск...' : 'Найти'}
                </button>
                <label className="upload-btn">
                    <Upload size={16}/>
                    Свой MP3
                    <input type="file" accept="audio/*" onChange={handleLocalFile} hidden/>
                </label>
            </form>

            {error && <p className="error-text">{error}</p>}

            <div className="track-list">
                {tracks.map((track) => (
                    <button
                        key={track.id}
                        className={`track-item ${track.id === currentTrackId ? 'active' : ''}`}
                        onClick={() => onSelectTrack(track)}
                    >
                        <img src={track.artwork} alt={track.title}/>
                        <div className="track-meta">
                            <strong>{track.title}</strong>
                            <span>{track.artist}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}