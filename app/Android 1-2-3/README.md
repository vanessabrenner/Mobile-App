# 📚 Aplicație Mobilă pentru Gestionarea Cărților

Această aplicație mobilă permite utilizatorilor să gestioneze eficient o listă de cărți. Aplicația oferă funcționalități avansate, inclusiv autentificare JWT, stocare locală, notificări în timp real, integrarea locației, acces la cameră, gestionarea fișierelor și suport offline.

## 🚀 Funcționalități Principale

### 📌 Ecranul 1: Lista de Cărți
- **Vizualizare Cărți** – Afișează toate cărțile disponibile în bibliotecă.
- **Paginare și Infinite Scrolling** – Pe măsură ce derulezi, aplicația încarcă mai multe cărți automat.
- **Căutare și Filtrare** – Permite căutarea după titlu și filtrarea după disponibilitate.
- **Notificări în Timp Real** – Lista de cărți se actualizează automat prin WebSocket.

### ✍️ Ecranul 2: Adăugare/Modificare Carte
- **Adăugare Carte** – Apasă pe butonul "+" pentru a introduce o nouă carte în listă.
- **Modificare Carte** – Selectează o carte existentă pentru a-i actualiza informațiile.

## 🛠️ Funcționalități Adiționale

### 🔑 1. Autentificare utilizator cu JWT
- Utilizatorii se autentifică folosind un token JWT salvat în **local storage**.
- După autentificare, aplicația nu cere login la fiecare deschidere.
- Opțiune de deconectare pentru ștergerea tokenului.

### 💾 2. Stocare Locală a Datelor
- Cărțile sunt salvate în **local storage** pentru acces offline.
- La reconectare, datele sunt sincronizate automat cu serverul.

### 🌐 3. Comportament Online/Offline
- **Online** – Aplicația comunică cu serverul prin REST API securizat.
- **Offline** – Datele sunt salvate local și trimise când rețeaua devine disponibilă.

### 📖 4. Paginare și Infinite Scrolling
- Cărțile sunt afișate într-o listă paginată.
- Pe măsură ce utilizatorul derulează, se încarcă automat mai multe cărți.

### 🆕 5. Funcționalități Suplimentare
- 📍 **Localizare GPS** – Fiecare carte are asociată o locație prin **Google Maps**.
- 📂 **Gestionarea Fișierelor** – Suport pentru stocarea și accesarea fișierelor locale.
- 🎨 **Animații** – Experiență vizuală îmbunătățită prin mici animații.

---

