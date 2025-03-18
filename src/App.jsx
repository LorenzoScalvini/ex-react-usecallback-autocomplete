import React, { useState, useEffect } from 'react';

const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

export default function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${searchQuery}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Errore durante il fetch dei suggerimenti:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);
  useEffect(() => {
    debouncedFetchSuggestions(query);
  }, [query]);

  return (
    <div>
      <h1>Ricerca Prodotti</h1>
      <input
        type="text"
        placeholder="Cerca un prodotto..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>Caricamento...</p>}

      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      )}

      {query && suggestions.length === 0 && !loading && (
        <p>Nessun risultato trovato.</p>
      )}
    </div>
  );
}
