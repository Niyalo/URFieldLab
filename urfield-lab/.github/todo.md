# Outputs page enhancements todo

- [ ] Analyze `app/[year]/outputs/page.tsx` and `components/ArticlePreview.tsx` to identify sections to modify.
- [ ] Implement checkbox filters for Working Groups and Content Groups in the left sidebar.
- [ ] Wire filters to compute `visibleWorkingGroups` and `visibleContentGroups`.
- [ ] Replace collapsible article links with grid-card article previews in the right panel.
- [ ] Modify `components/ArticlePreview.tsx` to render cards with image/title/authors and a hover overlay that slides up showing the summary.
- [ ] Ensure anchor ids are preserved for deep-linking to article cards.
- [ ] Add article counts next to group titles in the right panel.
- [ ] Run a local build/type check and fix any lint/TS errors.
- [ ] Manual QA: check mobile and desktop layouts, checkbox behavior, and hover overlay transitions.

Notes:

- By default, no checkboxes are selected and all groups are visible. Selecting any checkbox in a set filters down to only the selected groups in that set.
- Two independent checkbox sets exist: Working Groups and Content Groups.
- The ArticlePreview card is responsive and the summary overlay appears on hover (touch devices will need alternate access).
