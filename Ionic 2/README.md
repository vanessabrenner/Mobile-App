# Aplicație Mobilă pentru Gestionarea Cărților

Această aplicație mobilă permite utilizatorilor să gestioneze eficient o listă de cărți. Aplicația oferă funcționalități avansate, inclusiv autentificare JWT, stocare locală, notificări în timp real și comportament offline.

Aplicația este structurată în două ecrane principale, fiecare având funcționalități specifice.

## Ecranul 1: Lista de Cărți
- **Vizualizare Cărți**: Aici poți consulta toate cărțile disponibile în bibliotecă.
- **Paginare și Infinite Scrolling**: Pe măsură ce derulezi, aplicația încarcă mai multe cărți automat, utilizând **infinite scrolling**.
- **Funcționalitate de Căutare și Filtrare**: Permite căutarea cărților dupa titlu și filtrarea lor dupa disponibilitate.
- **Notificări în Timp Real**: WebSocket-ul actualizează automat lista de cărți când sunt efectuate modificări.

## Ecranul 2: Adăugare/Modificare Carte
- **Adăugare Carte**: Apasă pe butonul "+" pentru a introduce o nouă carte în listă.
- **Modificare Carte**: Dacă alegi o carte existentă, poți actualiza informațiile acesteia.

## Funcționalități Adiționale

### 1. **Autentificare utilizator cu JWT**
- Utilizatorii se autentifică folosind un token JWT care este salvat în **local storage**.
- După autentificare, aplicația nu redirecționează utilizatorul către pagina de login la fiecare deschidere a aplicației.
- Utilizatorii pot să se deconecteze și să șteargă tokenul din local storage.

### 2. **Stocarea datelor în Local Storage**
- Cărțile obținute de la server sunt salvate în **local storage**.
- Aplicația permite utilizatorilor să acceseze cărțile și atunci când nu sunt conectați la internet (mod offline).
- Când aplicația se reconectează la rețea, datele care nu au fost trimise sunt sincronizate cu serverul.

### 3. **Comportament Online/Offline**
- Aplicația detectează automat starea rețelei și se comportă diferit în funcție de aceasta:
  - **Online**: Aplicația trimite datele către server folosind serviciile REST securizate.
  - **Offline**: Aplicația salvează datele local și le trimite mai târziu când rețeaua devine disponibilă.

### 4. **Paginare și Infinite Scrolling**
- Cărțile sunt afișate într-o listă paginată.
- Pe măsură ce utilizatorul derulează, aplicația încarcă automat mai multe cărți utilizând **infinite scrolling**
