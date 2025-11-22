# Kategori-funktionalitet

## Setup - Viktigt!

För att kategori-funktionaliteten ska fungera måste du först skapa databastabellen. Kör följande kommandon i PowerShell:

```powershell
# Generera Prisma klient
npx prisma generate

# Skapa och kör migration
npx prisma migrate dev --name add_category_model
```

Detta skapar `category`-tabellen i din PostgreSQL-databas med följande kolumner:
- `id` (UUID, primary key)
- `name` (string)
- `showInNavbar` (boolean)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## Funktioner

### Skapa kategori
- Gå till `/admin/kategorier`
- Fyll i kategorinamn
- Bocka i "Visa i navigering" om kategorin ska synas i navbar-dropdown
- Klicka "Skapa kategori"

### Redigera kategori
- På `/admin/kategorier` klicka "Redigera" på önskad kategori
- Ändra namn och/eller visa-i-navbar-inställning
- Klicka "Spara ändringar"

### Ta bort kategori
- På `/admin/kategorier` klicka "Ta bort" på önskad kategori
- Bekräfta borttagning

## Navbar dropdown

Kategorier med `showInNavbar = true` visas automatiskt i en dropdown under "Produkter" i huvudnavigationen. Dropdown-menyn innehåller:
- "Alla produkter" (länk till `/produkter`)
- Separator
- Alla kategorier som är markerade att visas (länkar till `/produkter?category=<id>`)

Navbar uppdateras automatiskt när kategorier skapas, redigeras eller tas bort tack vare `revalidatePath()`.
