# A11y feedback request - Option List component

## Delivery overview

Option List is a new component that shows selectable options inline, without a dropdown. It exposes the internal options list that Select and Multiselect use in their dropdowns, so the rows, roles, ARIA attributes, keyboard handling and screen reader announcements are the same. Select and Multiselect don't change.

**Use cases:**

- [Follow-up questions pattern](https://core.cloudscape.aws.dev/gen-ai/patterns/follow-up-questions/): the user picks one or several answers in a dialog. Single selection was reviewed in [AWSUI-61957](https://issues.amazon.com/issues/AWSUI-61957). Multi selection hasn't been reviewed yet.
- Composition: builders combine Dropdown and Option List to build their own Select or Multiselect.

**Links:**

- [Kick-off and scope sign-off](https://chorus.aws.dev/doc/CUJAl2wq1b6Z/XS-Kick-off--Scope-Sign-off---Options-list)
- [API proposal](https://chorus.aws.dev/doc/5evHnSwN7iHe/API-Proposal-New-option-List-component)
- Implementation: [#5180](https://github.com/cloudscape-design/components/pull/5180)

## Testing instructions

Test with a screen reader (VoiceOver, NVDA or JAWS) on these pages:

- [Simple](https://d21d5uik3ws71m.cloudfront.net/components/27dd446e522e3cbc9571c6dfd5847dc14427bc3c/dev-pages-react16/index.html#/option-list/simple): three lists, single selection, multi selection, and multi selection with groups.
- [Scroll](https://d21d5uik3ws71m.cloudfront.net/components/27dd446e522e3cbc9571c6dfd5847dc14427bc3c/dev-pages-react16/index.html#/option-list/scroll): a 100-option list in a scroll container (`container=wrapper`), on the page (`container=page`), or in a Dropdown (`container=dropdown`). `preselected=near-end` selects "Option 81" when the page loads.
- Permutations: [single selection](https://d21d5uik3ws71m.cloudfront.net/components/27dd446e522e3cbc9571c6dfd5847dc14427bc3c/dev-pages-react16/index.html#/option-list/permutations-single) and [multi selection](https://d21d5uik3ws71m.cloudfront.net/components/27dd446e522e3cbc9571c6dfd5847dc14427bc3c/dev-pages-react16/index.html#/option-list/permutations-multi): visual states.
- [Select](https://core.cloudscape.aws.dev/components/select/) and [Multiselect](https://core.cloudscape.aws.dev/components/multiselect/): to compare with the current behavior.

**What's new compared with Select and Multiselect.** These come from the list being always visible instead of inside a dropdown:

- **Tab stop** (Simple, any list): Tab into the list. Focus lands on the list, and Tab again leaves it. The list is labelled by the heading above it.
- **Highlight on focus** (Simple, multi selection): select "Increase reliability", Tab out, then Tab back in. The first option, "Reduce cost", is highlighted, not the selected option. Embedded Multiselect (the value list in Property filter) behaves the same. See question 1.
- **Highlight cleared on Tab out** (Simple, any list): Tab out of the list. The highlight goes away.
- **Hover, then click** (Simple, any list): hover an option, then click it. The hovered option is selected, and moving the pointer out of the component clears the hover highlight.
- **Escape** (Simple, any list): press Escape. Nothing happens in the list. This is expected, so a surrounding Dialog or Dropdown can handle it.
- **Focus after selection** (Simple, single selection): select with Enter or Space. Focus stays in the list. This is expected.
- **Scrolling with the page or a container** ([Scroll, page](https://d21d5uik3ws71m.cloudfront.net/components/27dd446e522e3cbc9571c6dfd5847dc14427bc3c/dev-pages-react16/index.html#/option-list/scroll?container=page) and [Scroll, container](https://d21d5uik3ws71m.cloudfront.net/components/27dd446e522e3cbc9571c6dfd5847dc14427bc3c/dev-pages-react16/index.html#/option-list/scroll?container=wrapper)): Tab into the list and press Down and Up repeatedly, including Up from the first option to wrap to "Option 100". The highlighted option scrolls into view through the page or the container. See question 2 for Home and End.
- **In a Dropdown** ([Scroll, Dropdown](https://d21d5uik3ws71m.cloudfront.net/components/27dd446e522e3cbc9571c6dfd5847dc14427bc3c/dev-pages-react16/index.html#/option-list/scroll?container=dropdown)): press "Choose an option". Focus moves into the list. Select an option or press Escape, and focus returns to the button. The Dropdown and its focus handling are built on the dev page, the way a builder would compose them.

**Reused from Select and Multiselect,** for a quick check:

- **Selection** (Simple, single and multi selection): use Up, Down, Home and End, then Enter or Space. The selected state is announced.
- **Wrapping** (Simple, any list): Down on the last option moves to the first, and Up on the first moves to the last, as in Select and Multiselect.
- **Groups** (Simple, multi selection with groups): select the "Compute" header. Both options in the group are selected. Deselect one, and the header shows a mixed state.
- **Disabled option** (Simple, multi selection with groups): move to "Amazon EFS". Its disabled state and the reason "Not available in this Region." are announced.
- **Type-ahead** (Simple, single selection): type `i`. The highlight moves to "Improve performance". Wait about a second, then type `i` again to move to "Increase reliability". Typing more letters quickly extends the search.
- **Visual states** (Permutations): check contrast and the focus and highlight indicators in light, dark and forced-colors mode.

## Questions for reviewer

1. **Highlight on focus.** When the Select and Multiselect dropdowns open with the keyboard, they highlight the selected option (in Multiselect, the one selected first). Option List highlights the first option and ignores the selection ([Scroll, Option 81 selected](https://d21d5uik3ws71m.cloudfront.net/components/27dd446e522e3cbc9571c6dfd5847dc14427bc3c/dev-pages-react16/index.html#/option-list/scroll?container=page&preselected=near-end)). Should Option List highlight the selected option as well? If several are selected, should it be the first in list order, as in the [ARIA listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/#keyboardinteraction), or the first selected, as in Multiselect? Should this be fixed for the select and multi-select as well?
2. **Home and End.** In Select, Multiselect and Option List, Home and End move the highlight to the first and last option, and the browser's own Home and End also run. In Option List this can scroll the page to its top or bottom ([Scroll, page](https://d21d5uik3ws71m.cloudfront.net/components/27dd446e522e3cbc9571c6dfd5847dc14427bc3c/dev-pages-react16/index.html#/option-list/scroll?container=page)). Should Option List block the page scroll, so Home and End only move the highlight, as in the [ARIA listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/#keyboardinteraction)? Should this be fixed for the select and multi-select as well?
3. **Type-ahead and disabled options.** In Select and Multiselect, Up and Down reach disabled options, but type-ahead skips them. Option List does the same (Simple, multi selection with groups: "Amazon EFS"). Should Option List follow this, or should type-ahead also reach disabled options, [APG suggests for disabled items in a listbox](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols)? Should this be fixed for the select and multi-select as well?

## Findings

| Type | Feedback | Possible solution | Severity | Status | Notes |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |