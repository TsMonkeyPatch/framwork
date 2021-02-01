
Table of Contents

- [1. Usage](#1-usage)
    - [1.0.1. module](#101-module)
  - [1.1. component](#11-component)
- [2. Examples](#2-examples)
  - [2.1. Custom trigger](#21-custom-trigger)
  - [2.2. Width strategy](#22-width-strategy)

Basic overlay container which can attached to any element or contain any content.

## 1. Usage

#### 1.0.1. module

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsMonkeyPatchOverlayModule } from '@tsmonkeypatch/core/overlay';

@NgModule({
    declarations: [
        ...
    ],
    imports: [
        OverlayModule
    ],
    providers: [
        ...
    ],
    exports: []
})
export class AppModule {}
```

### 1.1. component

```html
<!-- add directive to component, triggers on click -->
<button type="button" [tsMonkeyPatchOverlay]="overlay">Show Overlay</button>

<!--
    the overlay container which holds the overlay content
 -->
<tsmp-overlay #overlay>
    <span>a very basic overlay bound to my button</span>
</tsmp-overlay>
```

## 2. Examples 

### 2.1. Custom trigger 

Usage of a custom trigger possible values are **click(default)**, **focus**, **hover**.

```html
<!-- add directive to component, triggers on hover and dismiss on mouseout -->
<button [tsMonkeyPatchOverlay]="overlay" [tsMonkeyPatchOverlayTrigger]="'hover'" >
    hover me
</button>

<!--
    the overlay container which holds the overlay content
 -->
<tsmp-overlay #overlay>
    shows on over
</tsmp-overlay>
```

### 2.2. Width strategy 

By default width strategy is set to "auto", width is not set by the overlay it takes
what it can get.

Possible values **auto** or **host**, for text fields which should show a autocomplete it is 
maybe useful to set this on host. So the overlay will become the same width as it's host element
in this case the input field.

```html
<!-- add directive to component, triggers on focus and dismiss on blur -->
<input type="text" 
    [tsMonkeyPatchOverlay]="overlay"
    [tsMonkeyPatchOverlayTrigger]="'focus'"
    [widthStrategy]="'host'">

<!--
    the overlay container which holds the overlay content
 -->
<tsmp-overlay #overlay>
    Autocomplete goes here or a selectbox
</tsmp-overlay>
```