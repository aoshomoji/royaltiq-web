import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

type Catalog = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  spotify_streams: number;
  youtube_views: number;
  earnings_last_12mo: number;
  valuation_score: number;
  summary?: string;
  explanation?: string;
};

export default function CatalogsPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [summaryMap, setSummaryMap] = useState<Record<string, string>>({});
  const [explanationMap, setExplanationMap] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingExplainId, setLoadingExplainId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[DEBUG] Initial session check:', session);

      if (!session && mounted) {
        setLoadingAuth(false);
        router.push('/auth');
      } else if (session && mounted) {
        fetchCatalogs();
        setLoadingAuth(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[DEBUG] Auth state changed:', session);
      if (session && mounted) {
        fetchCatalogs();
        setLoadingAuth(false);
      } else if (!session && mounted) {
        router.push('/auth');
        setLoadingAuth(false);
      }
    });

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchCatalogs = async () => {
    const { data, error } = await supabase.from('catalogs').select('*');
    if (error) {
      console.error('Error fetching catalogs:', error);
    } else {
      setCatalogs(data || []);
    }
  };

  const generateSummary = async (catalog: Catalog) => {
    setLoadingId(catalog.id);
    try {
      const res = await fetch('http://localhost:8000/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catalog),
      });
      const data = await res.json();
      const summary = data.summary || data.error || 'No summary returned.';
      setSummaryMap(prev => ({ ...prev, [catalog.id]: summary }));
      if (data.summary) {
        await supabase.from('catalogs').update({ summary }).eq('id', catalog.id);
      }
    } catch (err: any) {
      setSummaryMap(prev => ({ ...prev, [catalog.id]: `Error: ${err.message}` }));
    }
    setLoadingId(null);
  };

  const generateExplanation = async (catalog: Catalog) => {
    setLoadingExplainId(catalog.id);
    try {
      const res = await fetch('http://localhost:8000/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catalog),
      });
      const data = await res.json();
      const explanation = data.explanation || data.error || 'No explanation returned.';
      setExplanationMap(prev => ({ ...prev, [catalog.id]: explanation }));
      if (data.explanation) {
        await supabase.from('catalogs').update({ explanation }).eq('id', catalog.id);
      }
    } catch (err: any) {
      setExplanationMap(prev => ({ ...prev, [catalog.id]: `Error: ${err.message}` }));
    }
    setLoadingExplainId(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (loadingAuth) {
    return (
      <div className="p-6 text-center text-gray-600">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded"
      >
        Sign Out
      </button>

      <h1 className="text-2xl font-bold mb-6">RoyaltIQ Catalog Explorer</h1>

      {catalogs.length === 0 ? (
        <p>No catalogs found.</p>
      ) : (
        catalogs.map(catalog => (
          <div key={catalog.id} className="bg-gray-100 p-4 rounded mb-6 shadow-sm">
            <p><strong>Title:</strong> {catalog.title}</p>
            <p><strong>Artist:</strong> {catalog.artist}</p>
            <p><strong>Genre:</strong> {catalog.genre}</p>
            <p><strong>Spotify Streams:</strong> {catalog.spotify_streams.toLocaleString()}</p>
            <p><strong>YouTube Views:</strong> {catalog.youtube_views.toLocaleString()}</p>
            <p><strong>Earnings (12mo):</strong> ${catalog.earnings_last_12mo.toLocaleString()}</p>
            <p><strong>RoyaltIQ Score:</strong> {catalog.valuation_score}</p>

            <button
              onClick={() => generateSummary(catalog)}
              className="bg-blue-600 text-white px-3 py-1 rounded mt-3"
            >
              {loadingId === catalog.id ? 'Generating...' : 'Generate Summary'}
            </button>

            <button
              onClick={() => generateExplanation(catalog)}
              className="bg-purple-600 text-white px-3 py-1 rounded ml-3"
            >
              {loadingExplainId === catalog.id ? 'Explaining...' : 'Explain Score'}
            </button>

            {summaryMap[catalog.id] && (
              <div className="mt-3 p-3 bg-white border rounded shadow-sm">
                <strong>Summary:</strong> {summaryMap[catalog.id]}
              </div>
            )}

            {explanationMap[catalog.id] && (
              <div className="mt-3 p-3 bg-white border rounded shadow-sm">
                <strong>Explanation:</strong> {explanationMap[catalog.id]}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

