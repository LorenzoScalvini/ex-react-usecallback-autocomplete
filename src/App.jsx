import React, { useState } from 'react';

export default function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Gestisce l'input dell'utente e fa la ricerca
  const handleInputChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    // Svuota i risultati se l'input è vuoto
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    // Debounce per evitare troppe chiamate API
    setTimeout(() => {
      // Chiamata API per prendere i prodotti
      fetch(
        `https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${searchQuery}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Errore nella risposta API');
          }
          return response.json();
        })
        .then((data) => {
          setSuggestions(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Errore durante il fetch dei suggerimenti:', error);
          setLoading(false);
        });
    }, 800);
  };

  return (
    <div>
      <h1>Ricerca Prodotti</h1>
      <input
        type="text"
        placeholder="Cerca un prodotto..."
        value={query}
        onChange={handleInputChange}
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
