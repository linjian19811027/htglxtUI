export const settings = useSettingsStore()

export const user = useUserStore()

export const tagsView = useTagsViewStore()
tagsView.$subscribe((_, state) => {
  localStorage.setItem(
    'visitedViews',
    JSON.stringify(
      // Delete matched to prevent json.stringify formatting errors
      state.visitedViews.map(i => ({
        ...i, matched: [],
      })),
    ),
  )
}, { immediate: true })
