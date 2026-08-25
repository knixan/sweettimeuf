# Användarguide – SweetTime UF

Den här guiden förklarar hur ni använder admin-panelen på [sweettime-uf.se/admin](https://www.sweettime-uf.se/admin) för att sköta produkter, kategorier, offerter, kunder och fakturor – helt utan att kunna programmera.

## Innehåll

- [Logga in och behörigheter](#logga-in-och-behörigheter)
- [Översikt](#översikt)
- [Produkter](#produkter)
- [Kategorier](#kategorier)
- [Offerter](#offerter)
- [Kunder](#kunder)
- [Admins](#admins)
- [Inställningar](#inställningar)
- [Redigera texter på sajten (Sanity)](#redigera-texter-på-sajten-sanity)
- [Vanliga frågor](#vanliga-frågor)
- [Idéer för framtiden](#idéer-för-framtiden)

---

## Logga in och behörigheter

Gå till [/logga-in](https://www.sweettime-uf.se/logga-in) och logga in med ert konto. Vanliga kundkonton kommer inte in på admin-sidorna – bara konton som fått utökad behörighet.

Det finns två nivåer:

| Nivå | Kan göra |
| --- | --- |
| **Redaktör** | Hantera produkter, kategorier och offerter |
| **Admin** | Allt en redaktör kan, plus hantera kunder, ge andra personer admin-behörighet, redigera ordrar och skapa fakturor |

Ingen kan ge sig själv utökad behörighet genom att bara registrera ett konto – det måste göras av en admin, se [Admins](#admins). Vill ni ge någon redaktörs-behörighet räcker det i dagsläget inte att göra det själva på Admins-sidan – hör av er till utvecklaren.

## Översikt

`/admin` visar en startsida med genvägar till varje del. Redaktörer ser Produkter, Kategorier och Offerter. Admins ser även Kunder, Admins och Inställningar.

## Produkter

**Sida:** `/admin/produkter`

Här listar ni alla produkter. Klicka på en produkt för att redigera den, eller på **"Ny produkt"** för att skapa en ny.

### Fält i produktformuläret

| Fält | Vad det gör |
| --- | --- |
| **Titel** \* | Produktens namn – visas överallt på sajten |
| **Kategori** | Vilken kategori produkten hör till (styr var den dyker upp) |
| **Art. nummer** | Ert eget artikelnummer, valfritt |
| **Sammanfattning** | Kort text som syns i produktlistor |
| **Om produkten** | Längre beskrivning på produktsidan |
| **Pris och antal** | En rad per kvantitet ni säljer i, t.ex. 100 st / 500 st / 1000 st, med tillhörande pris. Kunden väljer bland dessa när de handlar |
| **Information / detaljer** | Fritext, t.ex. minsta order, hållbarhet, leveranstid |
| **Val av smak/färg** | Valfritt – lägg till alternativ kunden kan välja mellan, med ett eventuellt pristillägg |
| **Bilder** | En eller flera bilder – första bilden blir huvudbild |
| **Tillåt kund att ladda upp bild** | Kryssruta – visar en uppladdningsknapp på produktsidan där kunden kan ladda upp sin egen bild eller PDF innan de beställer |
| **Tryckfiler / mallar** | Nedladdningsbara mallar som kunden kan hämta på produktsidan |

> **Viktigt:** Kunden kan bara beställa en kvantitet som faktiskt finns som en egen rad under "Pris och antal". Lägger ni inte in t.ex. 250 st som en rad, går det inte att beställa 250 st – oavsett vad kunden själv skriver in.

Ta bort en produkt via papperskorgs-knappen i listan – det går inte att ångra.

## Kategorier

**Sida:** `/admin/kategorier`

Skapa en kategori med ett **namn** och kryssrutan **"Visa i navigering"**, som styr om kategorin syns i menyn högst upp på sajten.

Kategorier kan redigeras och tas bort. Tar ni bort en kategori försvinner inte produkterna i den – de tappar bara sin koppling till kategorin.

## Offerter

**Sida:** `/admin/offerter`

Alla beställningar som kommer in via kassan hamnar här som "offerter". Fakturering sker manuellt, inte automatiskt vid beställning.

### Filter

Flikarna högst upp filtrerar listan: **Alla**, **Ohanterad**, **Hanterad**, **Skickad**, **Faktura skickad**.

### Vad ni kan göra på en offert

- **Visa detaljer** – öppnar ordern och visar leverans-/fakturaadress, alla produkter med antal och pris, en eventuell bild kunden laddat upp, och kundens egna anteckningar
- Tre kryssrutor styr status: **Hanterad**, **Skickad**, **Faktura skickad** – etiketten i listan (Ohanterad/Hanteras/Skickad/Faktura skickad) uppdateras automatiskt utifrån dessa
- **Redigera** (kräver admin) – ändra kundens uppgifter, adresser, eller vad som helst i beställningen: antal, pris, lägg till en ny rad (t.ex. rabatt eller frakt) eller ta bort en rad. Totalsumman räknas alltid om automatiskt när ni sparar.
- **Generera faktura** (kräver admin) – skapar en färdig PDF-faktura med era företagsuppgifter, Swish/bankgiro och allt som ingår i beställningen, och öppnar den i en ny flik. Fakturanumret sätts första gången ni genererar fakturan för en order och ändras aldrig efter det, även om ni laddar ner den igen senare.
- **Ta bort kundens uppladdade bild** – tar bort en bild kunden laddat upp (t.ex. efter att den använts, eller om den var olämplig)
- **Ta bort** – raderar hela offerten permanent, går inte att ångra

> **Moms:** varje offert visar om kunden handlade som privatperson (inkl. 12 % moms) eller företag/förening (exkl. moms) – det styrs av väljaren högst upp på sajten och avgör vilket pris kunden fick.

## Kunder

**Sida:** `/admin/kunder` — kräver admin

Listar alla registrerade kundkonton. Ett konto kan tas bort permanent härifrån – det tar bort kontot, men inte kundens tidigare offerter.

## Admins

**Sida:** `/admin/admins` — kräver admin

- **Lägg till admin** – skriv in e-postadressen till en person som redan har ett konto på sajten (de måste ha registrerat sig först), så får kontot admin-behörighet.
- **Ta bort admin** – tar bort admin-behörigheten från ett konto, personen blir då en vanlig kund igen. Ni kan inte ta bort er egen admin-behörighet härifrån.

## Inställningar

**Sida:** `/admin/installningar` — kräver admin

Företagsuppgifterna som visas på fakturor ni genererar:

| Fält | Vad det gör |
| --- | --- |
| **Logga** | Ladda upp en bildfil – visas överst på fakturan |
| **Företagsnamn** | Obligatoriskt |
| **Organisationsnummer** | Valfritt, visas under företagsnamnet |
| **Adress / Postnummer / Ort** | Er avsändaradress på fakturan |
| **Swish-nummer** | Visas som betalningsinformation på fakturan |
| **Bankgironummer** | Visas som betalningsinformation på fakturan |

Fyll i dessa innan ni börjar skicka fakturor på riktigt – annars blir betalningsinformationen tom och kunden vet inte hur de ska betala.

## Redigera texter på sajten (Sanity)

Texterna på förstasidan (Hero), Om oss-sidan, Köpvillkor och Integritetspolicy går att redigera själva, utan att röra kod. Produkter och kategorier redigeras fortfarande på vanligt sätt i admin-panelen som beskrivet ovan – det här gäller bara löptexterna på de sidorna.

**Så gör ni:**

1. Gå till **[er webbadress]/studio** (t.ex. `https://www.sweettime-uf.se/studio`)
2. Logga in med samma konto som användes för att skapa sidan
3. Under "Innehåll" i menyn hittar ni **Hero**, **Om oss-sida**, **Köpvillkor** och **Integritetspolicy** – redigera texten och klicka **Publicera**
4. Ändringen syns på sajten inom några sekunder, ingen behöver göra något tekniskt för att den ska slå igenom

Om en sida råkar sakna text i redigeringsverktyget visas samma text som fanns där från början – sidan blir aldrig tom eller trasig.

## Vanliga frågor

**Jag loggade in men kommer inte in på /admin.**
Kontot har ingen utökad behörighet ännu. Be en admin ge er redaktörs- eller admin-behörighet.

**Jag är redaktör men ser inte Kunder eller Admins i menyn.**
Det är avsett – de sidorna kräver admin-behörighet. Be en admin om hjälp med kund- eller adminhantering.

**En kund kan inte beställa den kvantitet jag tänkt mig.**
Kontrollera att exakt den kvantiteten finns som en egen rad under "Pris och antal" på produkten.

**Var skickas orderbekräftelser och kontaktmeddelanden?**
Via mejl, direkt till kundens och er inkorg. Kontaktformulärets meddelanden går till `lg.sweets10@gmail.com` med kundens mejladress som svarsadress.

**Jag är redaktör men ser inte "Redigera" eller "Generera faktura" på en offert.**
Det är avsett – att ändra belopp och skapa fakturor kräver admin-behörighet. Redaktörer kan fortfarande se offertdetaljer och markera status.

**Jag genererade en faktura innan jag fyllt i Inställningar – blir den fel nu?**
Nej. Fakturanumret sätts en gång för alla första gången ni genererar fakturan och ändras aldrig efter det. Men innehållet på fakturan (företagsnamn, Swish, bankgiro) hämtas på nytt varje gång ni laddar ner den – så laddar ni ner samma faktura igen efter att ha fyllt i Inställningar, visas de rätta uppgifterna, med samma fakturanummer som innan.

## Idéer för framtiden

Saker som diskuterats men inte är byggda än. Markera gärna vad ni vill prioritera.

### Överlämning av drift

Sajten körs idag på Josefines egna konton hos de tjänster som håller sajten igång. Innan sajten går i skarp drift under Sweet Time UF bör dessa flyttas över till företagets egna konton:

- **Mejl:** byt ut dagens avsändaradress (kopplad till Josefines privata Gmail) mot en kopplad till er egen domän – så att orderbekräftelser och kontaktmeddelanden går ut från rätt avsändare.
- **Koden:** överför ägarskapet av kodförrådet (GitHub) till Sweet Time UF – ni har redan ett eget konto där.
- **Driften (Vercel):** flytta sajten till ert eget konto hos tjänsten som håller den igång dygnet runt – ni har redan ett eget konto där.
- **Databasen (Neon):** ni behöver ett eget gratiskonto hos tjänsten som lagrar all data (produkter, kunder, ordrar), så att Sweet Time UF äger sin egen information oberoende av Josefines konto.
- **Sanity:** ni behöver också ett eget gratiskonto för textredigeringsverktyget, och få det överfört dit (se avsnittet ovan om att redigera texter).

### Kortbetalning för privatpersoner

Idag går alla beställningar via kassan som en "offert" – ingen betalning sker på sajten, faktura skickas manuellt i efterhand. Ett alternativ är att lägga till kortbetalning direkt i kassan, åtminstone för privatpersoner (företag/föreningar vill oftast ändå ha faktura mot betalningsvillkor, den delen kan vara kvar som idag).

**Rekommendation: behåll faktura och vänta med kortbetalning.** Anledningen är inte att det skulle vara riskabelt att bygga – det är ett välbeprövat, standardmässigt tillägg. Den egentliga konflikten är att kortbetalning kräver ett exakt, färdigt belopp **innan** kunden betalar, medan er nuvarande modell bygger på att lägga till kostnader som varierar (expresstillägg, annan förpackning, klichékostnad) **efteråt** på fakturan. Man skulle antingen behöva bygga in alla de valen i kassan innan betalning, eller ta en andra betalning i efterhand för sånt som tillkommer – båda krångligare än dagens flöde. Utöver det krävs en riktig företagsverifiering hos betaltjänsten för att kunna få utbetalningar – värt att kolla om Sweet Time UF som UF-företag ens kan öppna ett fullständigt konto där innan man lägger tid på det.

- Skulle sannolikt bara aktiveras när köparen valt "Privatperson" i väljaren – företag fortsätter få faktura
- Påverkar orderflödet: en betald order bör markeras annorlunda än dagens "ohanterad/hanterad/skickad/faktura skickad"-status

### Fraktkostnader

**Just nu tillkommer ingen fraktkostnad någonstans i flödet** – varken i kassan eller på fakturan. Bestäm om frakt ska vara inräknad i priset (enklast för kunden, inga överraskningar) eller läggas på separat vid fakturering (mer rättvist om leveranser varierar mycket i vikt/storlek). Att lägga till en fraktavgift i kassan är en förhållandevis liten ändring att bygga när ni bestämt er.

### Synas på Google och Bing

Grunden finns redan på plats sen tidigare – det som återstår är mest att verifiera och skicka in, inte att bygga något nytt:

- **Verifiera domänen i Google Search Console.** Görs via en inställning hos er domänleverantör (t.ex. Loopia). Detta är det viktigaste steget – utan det vet Google inte att sajten finns, oavsett hur bra den är.
- **Verifiera i Bing Webmaster Tools** på samma sätt.
- **Skicka in sajtens sidkarta manuellt** i båda verktygen efter verifiering – snabbar upp att sajten börjar synas i sökresultat.
- **Skapa en Google Business-profil** – separat från sajten, kräver inget byggande, men avgörande för att synas i Google Maps och lokala sökningar (t.ex. "godis Mjölby"). Bara ett gratiskonto att skapa.
- Kontrollera att favicon-ikonen (den lilla ikonen i webbläsarfliken) faktiskt är Sweet Time-loggan.

### Koppling till Fortnox

Om ni har eller skaffar Fortnox går det att koppla ihop sajten så att en beställning kan skickas över som ett fakturautkast till Fortnox med en knapptryckning, istället för att skriva av allt för hand. Ni fyller fortfarande i det som varierar (klichékostnad, expresstillägg) och skickar iväg fakturan från Fortnox som vanligt – ni behåller alltså den mänskliga kontrollen men slipper dubbelarbetet med att skriva av ordern.

- Kräver att ert Fortnox-abonnemang har utökad åtkomst påslagen (ofta en liten extra kostnad utöver vanligt abonnemang)
- En rimlig storlek på jobb att bygga, inte en stor ombyggnad av sajten

### Klichékostnad – automatisera eller inte?

Idag är klichékostnaden (1000 kr/design, 500 kr vid repetitionsorder) bara en varningstext på produktsidan och i kassan – den räknas inte in i totalsumman utan läggs på manuellt när fakturan skapas. **Rekommendation: behåll det manuella flödet tills vidare.** Att automatisera det helt kräver att systemet vet om en design är ny eller en upprepning av en tidigare beställning, vilket är svårt att avgöra tillförlitligt automatiskt. Vill ni ändå förenkla lite: lägg alltid till "ny design"-kostnaden automatiskt så fort en kund laddat upp en bild till en order, och hantera bara repetitionsrabatten manuellt vid fakturering – det täcker det vanligaste fallet.
