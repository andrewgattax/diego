# Piano di implementazione: Flash Diego su focus textarea "Sex?"

## Obiettivo
Quando la textarea "Sex?" in `PositionSection` riceve l'evento `onFocus`, deve essere chiamata la funzione `flash()` dal componente `Diego`.

## Approccio scelto
**Context/Provider** - Crea un React Context che fornisce la funzione `flash()` a tutti i componenti figli, evitando il prop drilling.

## File modificati/creati

### Nuovi file

#### `src/contexts/DiegoContext.tsx` (creato)
- Crea un `DiegoContext` con interfaccia `DiegoContextValue` che espone `flash: () => void`
- Implementa `DiegoProvider` che:
  - Gestisce internamente lo stato `opacity`
  - Implementa la funzione `flash()` con `useCallback`
  - Renderizza l'overlay dell'immagine Diego
- Esporta l'hook `useDiego()` per consumare il context dai componenti figli

### File modificati

#### `src/App.tsx`
- Rimosso: import del componente `Diego`
- Aggiunto: import di `{ DiegoProvider }` dal context
- Wrappato l'intero contenuto dell'app con `<DiegoProvider>`

#### `src/components/form/PositionSection.tsx`
- Aggiunto: import di `{ useDiego }` dal context
- Destrutturato `flash` all'interno del componente
- Aggiunto: prop `onFocus={flash}` alla `<Textarea>` con id `location` (campo "Sex?")

#### `src/components/diego/Diego.tsx`
- Non modificato (il file esiste ma non viene più importato - la logica è stata spostata nel provider)

## Flusso di esecuzione

```
User clicca sulla textarea "Sex?"
    ↓
onFocus si attiva
    ↓
flash() viene chiamata (via useDiego context)
    ↓
DiegoContext setOpacity(1)
    ↓
Overlay Diego appare (opacity = 1)
    ↓
Dopo 10ms: setOpacity(0)
    ↓
Overlay Diego scompare
```
