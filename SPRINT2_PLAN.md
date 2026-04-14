# Sprint 1 — Plan (1 tydzień)

## Cel sprintu
Dostarczyć MVP backendu i przykładowego frontendu aplikacji do zarządzania projektami i zadaniami, które umożliwi użytkownikowi:
- rejestrację konta
- logowanie do aplikacji
- zapis danych użytkownika w bazie danych
- dostęp do podstawowego API aplikacji

---

## Zakres (wybrane z BACKLOG.csv)
- **US1** — Rejestracja użytkownika 
- **US2** — Logowanie
- **US5** — Dodawanie zadań
- **US10** — Edycja profilu użytkownika 
- **TECH1** — Baza danych
- **TECH2** — API backend (użytkownicy)
- **TECH3** — API backend (zadania)
- **TECH8** — Autoryzacja (token JWT)
  
---

## Zadania techniczne
**US1 — Rejestracja użytkownika**
- Implementacja mechanizmu rejestracji użytkownika
- POST /register — rejestracja użytkownika
- Walidacja danych wejściowych użytkownika
- Hashowanie hasła użytkownika przed zapisaniem w bazie danych

**US2 — Logowanie**
- Implementacja mechanizmu logowania użytkownika
- POST /login — logowanie użytkownika

**US5 — Dodawanie zadań**
- Implementacja mechanizmu dodawania zadania
- POST /tasks — tworzenie nowego zadania
- Zadanie jest widoczne w kontekście projektu po dodaniu

**US10** — Edycja profilu użytkownika 
- Możliwość zmiany danych osobowych użytkownika 
- Możliwość zmiany hasła użytkownika 

**TECH1 — Baza danych**
- Projekt i implementacja bazy danych (tabele: users, tasks)
- Konfiguracja połączenia aplikacji z bazą danych

**TECH2 — API użytkownicy**
- Implementacja modelu użytkownika (np. User)
- Implementacja podstawowych endpointów API

**TECH3 — API zadania**
- Implementacja modelu zadania (np. Task)
- Implementacja podstawowych endpointów API

**TECH8** — Autoryzacja (token JWT)
- Uwierzytelnianie zalogowanych użytkowników za pomocą tokenta JWT

---

## Definition of Done
- Użytkownik może się zarejestrować w aplikacji
- Dane użytkownika zapisują się poprawnie w bazie danych
- Użytkownik może się zalogować przy użyciu poprawnych danych
- Endpointy API działają poprawnie i zwracają odpowiednie odpowiedzi.
- Zmiany zostały zatwierdzone przez cały zespół programistyczny
- Użytkownik może dodać nowe zadanie do bazy danych
- Użytkownik może edytować swoje dane osobowe wraz z hasłem
- Użytkownik jest uwierzytelniony za pomocą tokenta JWT 

---

## Ryzyka sprintu
- **Problemy z konfiguracją bazy danych mogą opóźnić implementację** (plan awaryjny: użycie prostszej lokalnej bazy np. SQLite)
- **Błędy w implementacji logowania i hashowania haseł** (plan awaryjny: użycie sprawdzonej biblioteki do autoryzacji)
- **Brak czasu na pełne testy API** (plan awaryjny: wykonanie testów manualnych endpointów)
