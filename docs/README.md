# VTEX Sticky Layout

This component is used to make its children have sticky behaviour.

For now, it supports two position states `bottom` and `top`.

Passing the prop `"position": "bottom"` in your blocks.json, makes its children stick to the bottom of its view, while it should be hidden and once it reaches the position it should be, it stops and stays there.

You can understand more by reading this example: https://www.w3schools.com/howto/howto_css_sticky_element.asp

### Layout API

This props should be edited at your theme's `blocks.json`

| Prop name         | Type           | Description                                                                  | Default value |
| ----------------- | -------------- | ---------------------------------------------------------------------------- | ------------- |
| `blockClass`      | `String`       | Unique class name to be appended to block container class                    | `""`          |
| `position`        | `PositionEnum` | Indicates where the component should stick                                   | N/A           |
| `verticalSpacing` | `Number`       | Indicates the distance in pixels from the position chosen in `position` prop | 0             |

`PositionEnum` description:

| Enum name | Enum value | Description                                  |
| --------- | ---------- | -------------------------------------------- |
| TOP       | 'top'      | Component will stick to the top of screen    |
| BOTTOM    | 'bottom'   | Component will stick to the bottom of screen |

### Example usage

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
