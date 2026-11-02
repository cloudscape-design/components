# Icon-to-content gap measurements

Measured in headless Chrome 157 (puppeteer-core, viewport 1200x900, light mode) against the dev server on 127.0.0.1:8080, with `measure.cjs` in this directory. Raw output: `before-measurements.txt` and `after-measurements.txt`.

- **glyphGap**: `content.left - svg.right`, the visible space between the icon glyph and the label/description column.
- **wrapperGap**: `content.left - (element before content).right`. It is 0 everywhere because the spacing is padding inside the icon slot, not a margin.

| Surface (page) | Rows with icon | glyphGap before | glyphGap after | Icon slot element |
|---|---|---|---|---|
| OptionList, single (`option-list/permutations`) | 16 | **0px** | **8px** | before: `<Icon>` root (`awsui_icon_h11ix…`); after: OptionList `.icon` (`awsui_icon_15gzf…`) |
| OptionList, multi (`option-list/permutations`) | 24 | **0px** | **8px** | same as above |
| Select item, single (`select/item.permutations`) | 5 | 8px | 8px | shared option `.icon` (`awsui_icon_1p2cx…`) |
| Multiselect item, multi (`select/item.permutations`) | 6 | 8px | 8px | shared option `.icon` |
| Select dropdown (`select/screenshot`, opened) | 2 | 8px | 8px | shared option `.icon` |
| Multiselect dropdown (`multiselect/disabled-reason`, opened) | 2 | 8px | 8px | shared option `.icon` |

The icon is 16px wide in every case. 8px is `space-xs`, the `padding-inline-end` of the shared option `.icon`.

Screenshots:
- before: `before-option-list-single-0.png`, `before-option-list-single-1.png`, `before-option-list-multi-2.png`, `before-option-list-multi-3.png`, `before-select-item-permutations.png`, `before-select-dropdown.png`, `before-multiselect-dropdown.png`
- after: the same names with the `after-` prefix
