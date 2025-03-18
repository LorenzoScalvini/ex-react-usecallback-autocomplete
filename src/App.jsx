import React, { useState } from 'react';
import styles from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  // Funzione per gestire il click su un prodotto
  const handleProductClick = (productId) => {
    // Nascondo la tendina
    setSuggestions([]);

    // Mostro il loading
    setLoadingDetails(true);

    // Chiamata API per ottenere i dettagli del prodotto
    fetch(
      `https://boolean-spec-frontend.vercel.app/freetestapi/products/${productId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Errore nella risposta API');
        }
        return response.json();
      })
      .then((data) => {
        setSelectedProduct(data);
        setLoadingDetails(false);
      })
      .catch((error) => {
        console.error('Errore durante il fetch dei dettagli:', error);
        setLoadingDetails(false);
      });
  };

  // Funzione per tornare alla ricerca
  const handleBackClick = () => {
    setSelectedProduct(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ricerca Prodotti</h1>
      <input
        type="text"
        placeholder="Cerca un prodotto..."
        value={query}
        onChange={handleInputChange}
        className={styles.searchInput}
      />

      {loading && <p className={styles.loadingMessage}>Caricamento...</p>}

      {suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((product) => (
            <li
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className={styles.suggestionItem}
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}

      {query && suggestions.length === 0 && !loading && !selectedProduct && (
        <p className={styles.noResultsMessage}>Nessun risultato trovato.</p>
      )}

      {/* Dettagli del prodotto selezionato */}
      {loadingDetails && (
        <p className={styles.loadingMessage}>Caricamento dettagli...</p>
      )}

      {selectedProduct && !loadingDetails && (
        <div className={styles.productDetails}>
          <button onClick={handleBackClick} className={styles.backButton}>
            Torna Indietro
          </button>
          <h2 className={styles.productTitle}>{selectedProduct.name}</h2>
          {selectedProduct.image && (
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className={styles.productImage}
            />
          )}
          <p className={styles.productDescription}>
            {selectedProduct.description}
          </p>
          <p className={styles.productPrice}>
            Prezzo: ${selectedProduct.price}
          </p>
        </div>
      )}
    </div>
  );
}
