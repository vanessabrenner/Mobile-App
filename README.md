# Aplicație Mobilă pentru Gestionarea Cărților

Această aplicație mobilă permite utilizatorilor să gestioneze eficient o listă de cărți. Aplicația este structurantă în două ecrane principale, fiecare având funcționalități specifice.

## Ecranul 1: Lista de Cărți
- **Vizualizare Cărți**: Aici poți consulta toate cărțile disponibile în bibliotecă.
- **Funcționalitate de Editare**: Poți selecta o carte din listă pentru a-i modifica detaliile.

## Ecranul 2: Adăugare/Modificare Carte
- **Adăugare Carte**: Apasă pe butonul "+" pentru a introduce o nouă carte în listă.
- **Modificare Carte**: Dacă alegi o carte existentă, poți actualiza informațiile acesteia.

## Detalii despre Entitatea Carte
Entitatea Carte conține următoarele câmpuri esențiale:
- **id**: Un identificator unic pentru fiecare carte.
- **title**: Titlul cărții.
- **author**: Autorul cărții.
- **pages**: Numărul de pagini ale cărții.
- **inStock**: Indică disponibilitatea cărții în stoc.

## Tehnologii Utilizate
- **React**: Biblioteca principală utilizată pentru construirea interfeței aplicației.
- **Ionic**: Cadru de dezvoltare pentru aplicații mobile.
- **WebSocket**: Tehnologie care permite comunicarea în timp real cu serverul, asigurând actualizarea automată a listei de cărți.
