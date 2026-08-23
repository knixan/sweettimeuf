# Adminguide – SweetTime UF

Den här guiden förklarar hur man använder admin-panelen på [sweettime-uf.se/admin](https://www.sweettime-uf.se/admin) för att hantera produkter, kategorier, offerter och kunder.

## Innehåll

- [Logga in och roller](#logga-in-och-roller)
- [Översikt](#översikt)
- [Produkter](#produkter)
- [Kategorier](#kategorier)
- [Offerter](#offerter)
- [Kunder](#kunder)
- [Admins](#admins)
- [Vanliga frågor](#vanliga-frågor)

---

## Logga in och roller

Gå till [/logga-in](https://www.sweettime-uf.se/logga-in) och logga in med ditt konto. Kontot måste ha rollen `admin` eller `editor` för att komma åt `/admin` – vanliga kundkonton skickas tillbaka till startsidan.

Det finns två rollnivåer:

| Roll     | Kan hantera                                      | Kan **inte** hantera            |
| -------- | ------------------------------------------------- | -------------------------------- |
| `editor` | Produkter, kategorier, offerter                   | Kunder, adminanvändare           |
| `admin`  | Allt ovan + kunder och adminanvändare              | –                                 |

Nya konton på sidan får alltid rollen `user` (vanlig kund) och kan aldrig bli admin eller editor genom att registrera sig själva – det gör bara en befintlig admin via [Admins](#admins)-sidan.

## Översikt

`/admin` visar en startsida med genvägar till varje sektion. Vad du ser beror på din roll – `editor` ser Produkter, Kategorier och Offerter; `admin` ser även Kunder och Admins.

## Produkter

**Sida:** `/admin/produkter`

Här listas alla produkter. Klicka på en produkt för att redigera den, eller på **"Ny produkt"** för att skapa en.

### Fält i produktformuläret

| Fält | Beskrivning |
| --- | --- |
| **Titel** \* | Produktens namn – visas överallt på sajten |
| **Kategori** | Valfri koppling till en kategori (styr var produkten dyker upp under `/kategori/...`) |
| **Art. nummer** | Internt artikelnummer, valfritt |
| **Sammanfattning** | Kort text som visas i produktlistor/kort |
| **Om produkten** | Längre beskrivningstext på produktsidan |
| **Pris och antal** | En eller flera prisrader: `antal` + `pris (kr)`. Kunden väljer bland dessa rader i en dropdown vid köp – lägg till en rad per kvantitetssteg (t.ex. 100 st / 500 st / 1000 st) |
| **Information / detaljer** | Fritext för t.ex. minsta order, hållbarhet, leveranstid |
| **Val av smak/färg** | Valfritt. Ange en etikett (t.ex. "Välj smak") och lägg till alternativ med namn + ett eventuellt pristillägg i kr |
| **Bilder (URL)** | En eller flera bild-URL:er. Första bilden används som huvudbild |
| **Tillåt kund att ladda upp bild** | Kryssruta – visar ett fält på produktsidan där kunden kan klistra in en länk till egen design innan köp |
| **Tryckfiler / mallar** | Länkar till nedladdningsbara PDF-mallar som visas på produktsidan |

> **Viktigt om priser:** Kassan litar aldrig på vad kunden skickar in – den slår alltid upp det verkliga priset (och ett eventuellt varianttillägg) från produktens prisrader i databasen. Det betyder att en beställning bara går igenom om kunden väljer **exakt** en av de antal-rader du har lagt in, och en variant som faktiskt finns i listan. Lägger du inte in rätt kvantitet som en egen rad kan kunden inte beställa det antalet.

Produkter får automatiskt en unik URL-slug baserat på titeln (t.ex. "Tablettaskar 7010-1" → `/produkt/tablettaskar-7010-1`). Byter du titel på en befintlig produkt genereras en ny slug.

Ta bort en produkt via papperskorgs-knappen i listan – detta går inte att ångra.

## Kategorier

**Sida:** `/admin/kategorier`

Skapa en kategori med ett **namn** och kryssrutan **"Visa i navigering"**, som styr om kategorin dyker upp i navbarens meny. Slug (t.ex. `/kategori/godis`) genereras automatiskt från namnet.

Kategorier kan redigeras och tas bort från listan. Om en kategori tas bort behåller dess produkter sin data men tappar kopplingen till kategorin.

## Offerter

**Sida:** `/admin/offerter`

Alla beställningar som kommer in via kassan hamnar här som "offerter" (fakturering sker manuellt, inte automatiskt).

### Filter

Flikarna högst upp filtrerar listan: **Alla**, **Ohanterad**, **Hanterad**, **Skickad**, **Faktura skickad**.

### Per offert

- **Visa detaljer** – expanderar ordern och visar leverans-/fakturaadress, alla produkter med antal och pris, eventuell kunduppladdad design, och kundens övriga anteckningar
- Tre kryssrutor styr status: **Hanterad**, **Skickad**, **Faktura skickad** – status i listan (Ohanterad/Hanteras/Skickad/Faktura skickad) härleds automatiskt från dessa
- **Ta bort kundens uppladdade bild** – tar bort länken till en kunds designfil från ordern (t.ex. efter att den använts eller om den var olämplig)
- **Ta bort** – raderar hela offerten permanent, går inte att ångra

## Kunder

**Sida:** `/admin/kunder` — kräver `admin`-roll

Listar alla registrerade kundkonton (namn, e-post, om e-posten är verifierad, skapad-datum). Ett konto kan tas bort permanent härifrån – det raderar kontot men inte kundens tidigare offerter.

## Admins

**Sida:** `/admin/admins` — kräver `admin`-roll

- **Lägg till admin** – ange e-postadressen till en befintlig användare för att göra kontot till admin. Personen måste redan ha ett konto (registrerat sig) på sajten.
- **Ta bort admin** – tar bort adminrollen från ett konto (blir vanlig `user`) och skickas då tillbaka till att vara vanlig kund. Du kan inte ta bort din egen adminroll härifrån.

Notera att den här sidan bara hanterar rollen `admin`. Rollen `editor` sätts i dagsläget direkt i databasen och finns inte som knapp i gränssnittet.

## Vanliga frågor

**Jag loggade in men kommer inte in på /admin.**
Kontot har rollen `user` (vanlig kund). Be en befintlig admin ge dig `editor`- eller `admin`-rollen.

**Jag är editor men ser inte Kunder eller Admins i menyn.**
Det är avsett – de sidorna kräver `admin`-roll. Be en admin om hjälp med kund- eller adminhantering.

**En kund kan inte beställa den kvantitet jag tänkt mig.**
Kontrollera att exakt den kvantiteten finns som en egen rad under "Pris och antal" på produkten – kassan accepterar bara de exakta kvantiteter som är definierade där.

**Var skickas orderbekräftelser och kontaktmeddelanden?**
Via e-post (Nodemailer/SMTP), konfigurerat i `.env`. Kontaktformulärets meddelanden går till `lg.sweets10@gmail.com` med kundens e-post som svarsadress.
