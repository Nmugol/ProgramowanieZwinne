# Sprint 2 — Plan (4 tygodnie)

## Cel sprintu
Dostarczyć MVP backendu i przykładowego frontendu aplikacji do zarządzania projektami i zadaniami, które umożliwi użytkownikowi:
- rejestrację i logowanie (z poprawkami i stabilizacją działania)
- zarządzanie projektami (tworzenie, edycja, usuwanie, lista projektów, opuszczanie projektu)
- zarządzanie zadaniami (edycja, załączniki, komentarze)
- komunikację i interakcje między użytkownikami (komentarze, powiadomienia, powiadomienia email)
- korzystanie z API obsługującego użytkowników, projekty, zadania, komentarze i pliki
- odbieranie powiadomień w czasie rzeczywistym
- zapis i obsługę danych w zaktualizowanej strukturze bazy danych

---

## Zakres (wybrane z BACKLOG.csv)
- **US1** — Rejestracja użytkownika *[FIX]*
- **US2** — Logowanie *[FIX]*
- **US3** — Tworzenie projektu
- **US4** — Edycja projektu
- **US6** — Edycja zadania
- **US8** — Usuwanie projektu
- **US9** — Powiadomienia *[InProgress]*
- **US11** — Dodawanie załączników do zadań
- **US12** — Usuwanie załączników z zadań
- **US13** — Dodawanie komentarzy do zadań
- **US14** — Usuwanie komentarzy z zadań
- **US15** — Usuwanie powiadomień
- **US16** — Powiadomienia email
- **US17** — Wypisanie się z projektu
- **US19** — Wyświetlenie listy projektów
- **TECH1** — Baza danych *[FIX]*
- **TECH3** — API backend (zadania) *[FIX]*
- **TECH4** — API backend (projekty)
- **TECH5** — Komunikacja realtime
- **TECH6** — UI/UX aplikacji *[InProgress]*
- **TECH9** — Strona startowa
- **TECH10** — Wysyłanie wiadomości email
- **TECH11** — API backend (komentarze)
- **TECH12** — API backend (załączniki)
  
---

## Zadania techniczne
**US1 — Rejestracja użytkownika [FIX]**
- Poprawa walidacji danych wejściowych (email, hasło)
- Obsługa błędów (np. istniejący użytkownik)
- Usprawnienie hashowania hasła (np. bcrypt)
- Test endpointu POST /register

**US2 — Logowanie [FIX]**
- Poprawa procesu uwierzytelniania użytkownika
- Generowanie i walidacja tokenu JWT
- Obsługa błędnych danych logowania
- Test endpointu POST /login

**US3 — Tworzenie projektu**
- Implementacja modelu projektu (Project)
- POST /projects — tworzenie nowego projektu
- Powiązanie projektu z użytkownikiem (owner)
- Walidacja danych wejściowych

**US4 — Edycja projektu**
- PUT /projects/:id — edycja projektu
- Sprawdzenie uprawnień użytkownika (czy jest właścicielem)
- Aktualizacja danych projektu

**US6 — Edycja zadania**
- PUT /tasks/:id — edycja zadania
- Możliwość zmiany statusu, nazwy, opisu
- Walidacja danych wejściowych

**US8 — Usuwanie projektu**
- DELETE /projects/:id — usunięcie projektu
- Usunięcie powiązanych danych (zadania, komentarze itd.)
- Sprawdzenie uprawnień użytkownika

**US9 — Powiadomienia [InProgress]**
- Model powiadomień (Notification)
- Tworzenie powiadomień przy akcjach (np. komentarz)
- Endpoint do pobierania powiadomień użytkownika

**US11 — Dodawanie załączników do zadań**
- Obsługa uploadu plików
- POST /tasks/:id/attachments
- Powiązanie pliku z zadaniem
- Walidacja typu i rozmiaru pliku

**US12 — Usuwanie załączników z zadań**
- DELETE /attachments/:id
- Usunięcie pliku z serwera / storage
- Sprawdzenie uprawnień użytkownika

**US13 — Dodawanie komentarzy do zadań**
- Model komentarza (Comment)
- POST /tasks/:id/comments
- Powiązanie komentarza z użytkownikiem i zadaniem

**US14 — Usuwanie komentarzy z zadań**
- DELETE /comments/:id
- Sprawdzenie uprawnień (autor / admin)
- Usunięcie komentarza z bazy danych

**US15 — Usuwanie powiadomień**
- DELETE /notifications/:id
- Możliwość usunięcia pojedynczego powiadomienia

**US16 — Powiadomienia email**
- Integracja z usługą wysyłki email
- Wysyłanie emaili przy wybranych akcjach (np. komentarz)
- Szablony wiadomości

**US17 — Wypisanie się z projektu**
- DELETE /projects/:id/members/me
- Usunięcie użytkownika z projektu
- Aktualizacja relacji w bazie danych

**US19 — Wyświetlenie listy projektów**
- GET /projects
- Pobieranie projektów użytkownika
- Filtrowanie / sortowanie (opcjonalnie)

**TECH1 — Baza danych [FIX]**
- Aktualizacja struktury bazy danych (projekty, komentarze, załączniki, powiadomienia)
- Relacje między tabelami (users, projects, tasks, comments, attachments)
- Migracje bazy danych

**TECH3 — API backend (zadania) [FIX]**
- Refaktoryzacja endpointów związanych z zadaniami
- Dodanie obsługi edycji, komentarzy i załączników
- Poprawa struktury odpowiedzi API

**TECH4 — API backend (projekty)**
- Implementacja modelu projektu
- CRUD dla projektów
- Obsługa członków projektu

**TECH5 — Komunikacja realtime**
- Implementacja WebSocketów (np. Socket.io)
- Wysyłanie powiadomień w czasie rzeczywistym
- Obsługa zdarzeń (komentarze, zmiany w zadaniach)

**TECH6 — UI/UX aplikacji [InProgress]**
- Implementacja podstawowych widoków (dashboard, projekty, zadania)
- Formularze (logowanie, rejestracja, projekt)
- Integracja z API

**TECH9 — Strona startowa**
- Strona główna aplikacji
- Nawigacja do logowania/rejestracji

**TECH10 — Wysyłanie wiadomości email**
- Konfiguracja SMTP / API do wysyłki emaili
- Obsługa błędów wysyłki

**TECH11 — API do obsługi komentarzy w zadaniach**
- Endpointy CRUD dla komentarzy
- Powiązanie z zadaniami i użytkownikami

**TECH12 — API do obsługi plików w zadaniach**
- Upload, pobieranie i usuwanie plików
- Integracja ze storage (lokalny / chmura)

---

## Definition of Done
- Użytkownik może się zarejestrować i zalogować (po poprawkach mechanizmów autoryzacji)
- Użytkownik jest uwierzytelniany za pomocą tokena JWT
- Dane użytkownika, projektów, zadań, komentarzy i załączników zapisują się poprawnie w bazie danych
- Użytkownik może:
    - tworzyć, edytować i usuwać projekty
    - wyświetlać listę swoich projektów
    - wypisać się z projektu
- Użytkownik może edytować zadania
- Użytkownik może dodawać i usuwać:
    - komentarze do zadań
    - załączniki do zadań
- System obsługuje powiadomienia:
    - użytkownik może je wyświetlać i usuwać
    - część funkcjonalności działa w czasie rzeczywistym (WebSockety)
- System wysyła powiadomienia email dla wybranych zdarzeń
- Endpointy API (users, projects, tasks, comments, attachments) działają poprawnie i zwracają odpowiednie odpowiedzi
- Frontend umożliwia podstawową obsługę aplikacji (logowanie, projekty, zadania)
- Zmiany zostały przetestowane (manualnie lub częściowo automatycznie)
- Kod został zatwierdzony przez zespół programistyczny

---

## Ryzyka sprintu
- **Zbyt duży zakres sprintu** (plan awaryjny: ograniczenie funkcjonalności do wersji MVP, np. uproszczone powiadomienia)
- **Problemy z relacjami w bazie danych (projekty - użytkownicy - zadania)** (plan awaryjny: uproszczenie modelu danych lub etapowe wdrażanie relacji)
- **Błędy w autoryzacji i uprawnieniach** (plan awaryjny: tymczasowe uproszczenie logiki uprawnień i dokładne testy endpointów)
- **Problemy z uploadem plików i obsługą załączników** (plan awaryjny: ograniczenie typów plików lub użycie lokalnego storage zamiast zewnętrznego)
- **Problemy z komunikacją realtime (WebSockety)** (plan awaryjny: fallback do odświeżania danych zamiast realtime)
- **Problemy z wysyłką emaili (SMTP / API)** (plan awaryjny: mockowanie wysyłki emaili lub ograniczenie funkcji do logów systemowych)
- **Brak czasu na pełne testy wszystkich funkcjonalności** (plan awaryjny: testy manualne kluczowych endpointów i scenariuszy użytkownika)
