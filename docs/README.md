# VTEX Sticky Layout

The Sticky Layout app provides layout structures to help building elements that should be fixed relative to the viewport in certain contexts.

> Sticky positioning is a hybrid of relative and fixed positioning. The element is treated as relative positioned until it crosses a specified threshold, at which point it is treated as fixed positioned.
>
> You can understand more by reading about in the [MDN `position` documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/position#Sticky_positioning).

## Blocks

### `sticky-layout`

The `sticky-layout` block is responsible for making its children _stick_ to a certain position on the page when exiting the viewport while scrolling.

**Props:**

| Prop name         | Type           | Description                                                                      | Default value |
| ----------------- | -------------- | -------------------------------------------------------------------------------- | ------------- |
| `blockClass`      | `String`       | Unique class name to be appended to block container class                        | `""`          |
| `position`        | `PositionEnum` | Indicates where the component should stick                                       | `N/A`         |
| `verticalSpacing` | `Number`       | Indicates the distance in pixels from the position chosen in the `position` prop | `0`           |

`PositionEnum` options:

| Enum name | Enum value | Description                                  |
| --------- | ---------- | -------------------------------------------- |
| `TOP`     | `'top'`    | Component will stick to the top of screen    |
| `BOTTOM`  | `'bottom'` | Component will stick to the bottom of screen |

**CSS Handles:**

| Prop name          | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `container`        | Sticky layout container                                      |
| `container--stuck` | Sticky layout container when stuck to a position on the page |

#### Example usage

```js
  "store.product": {
    "children": [
      "flex-layout.row#product-breadcrumb",
      "flex-layout.row#product-main",
      "sticky-layout#buy-button"
    ],
    "parent": {
      "challenge": "challenge.address"
    }
  },
  "sticky-layout#buy-button": {
    "props": {
      "position": "bottom"
    },
    "children": ["flex-layout.row#buy-button"]
  },
  "flex-layout.row#buy-button": {
    "props": {
      "marginTop": 4,
      "marginBottom": 7,
      "paddingBottom": 2
    },
    "children": ["buy-button"]
  },
```

### `sticky-layout.stack-container`

The `sticky-layout.stack-container` block is can be used to orchestrate multiple `sticky-layout`s to have a stack behavior with each other.

In example, imagine three blocks: the first and the last being a `sticky-layout` and the second being any other block. A gap between both `sticky-layout`s will appear the moment the user starts scrolling the page. By defining those blocks inside a `sticky-layout.stack-container`, the second `sticky-layout` block will stick to the first `sticky-layout` instead of respecting the aformetioned gap.

**Props:**

| Prop name    | Type           | Description                                                                                                | Default value |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------------------- | ------------- |
| `blockClass` | `String`       | Unique class name to be appended to block container class                                                  | `""`          |
| `position`   | `PositionEnum` | Indicates where the component should stick. _It overrides the `position` of its children `sticky-layout`._ | `N/A`         |

`PositionEnum` options:

| Enum name | Enum value | Description                                  |
| --------- | ---------- | -------------------------------------------- |
| `TOP`     | `'top'`    | Component will stick to the top of screen    |
| `BOTTOM`  | `'bottom'` | Component will stick to the bottom of screen |
